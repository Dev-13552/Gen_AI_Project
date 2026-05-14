const { Router } = require('express')
const authController = require("../controllers/auth.controller.js")
const subController = require("../controllers/sub.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")
const upload = require("../middlewares/file.middleware.js")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)


/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


/**
 * @route POST /api/auth/update
 * @description update the user profile details and image
 * @access private
 */
authRouter.put("/update", authMiddleware.authUser, upload.single("image"), authController.updateUserProfileController)


/**
 * @route GET /api/auth/verify/
 * @description verifies the user email using the token sent to the email address
 * @access public
 */
authRouter.post("/verify", authController.verifyUserController)

/**
 * @route POST /api/auth/reverify/
 * @description re-sends the verification email to the user if the previous token has expired
 * @access public
 */
authRouter.post("/reverify", authController.reVerifyUserController)


/**
 * @route POST /api/auth/create-order
 * @description creates a new order for subscription
 * @access private
 */
authRouter.post("/create-order", authMiddleware.authUser, subController.capturePayment)


/**
 * @route POST /api/auth/verify-payment
 * @description verifies the payment signature and updates the user subscription status
 * @access private
 */
authRouter.post("/verify-payment", authMiddleware.authUser, subController.verifySignature)

module.exports = authRouter