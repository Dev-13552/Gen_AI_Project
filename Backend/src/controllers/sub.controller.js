const { razorpayInstance } = require("../config/razorpay.js");
const userModel = require("../models/user.model.js");
const crypto = require("crypto")

/**
 * @name capturePayment
 * @description Controller to capture payment and create an order in Razorpay.
 * @access private 
 */
async function capturePayment(req, res) {
  try {
    const id = req.user.id;

    const user = userModel.find({ id });

    if (user.status == "Paid") {
      return res.status(409).json({
        success: false,
        message: "User has already purchased the subscription!",
      });
    }

    const options = {
      amount: 20000,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: id,
      },
    };

    const paymentResponse = await razorpayInstance.orders.create(options);
    return res.status(200).json({
      success: true,
      response: paymentResponse,
    });
  } catch (error) {
    console.log("Error in creating order: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
  * @name verifySignature
  * @description Controller to verify the payment signature sent by Razorpay and update the user subscription status accordingly.
  * @access private
 */

async function verifySignature(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;
    console.log(razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,)

    const userId = req.user.id;
    if (paymentFailed) {
      const user = await userModel.findOneAndUpdate(
        { _id: userId },
        { status: "Failed" },
        { returnDocument: "after" },
      );
      return res.status(400).json({
        success: false,
        message: "Payment Failed",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature == expectedSignature) {
      const user = await userModel.findOneAndUpdate(
        { _id: userId },
        {
          status: "Paid",
        },
        { returnDocument: "after" },
      );
      console.log(user)
      return res.json({
        success: true,
        message: "Payment Successfull...",
        user
      });
    } else {
      await userModel.findOneAndUpdate(
        { _id: userId },
        { status: "Failed" },
        { returnDocument: "after" },
      );
      console.log("Invalid signature")
      return res
        .status(400)
        .json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Error in verifying payment: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
    capturePayment,
    verifySignature
}