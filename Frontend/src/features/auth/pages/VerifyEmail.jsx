import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import '../style/verify.scss'
import { AuthContext } from "../auth.context";
import { toast } from "sonner";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const [statusIcon, setStatusIcon] = useState("⌛");
  const navigate = useNavigate();
  const context = useContext(AuthContext)
  const {setUser} = context;

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setStatus("Email verified successfully.");
        setStatusIcon("✅");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
      setStatus("Verification failed. Please try again.");
      setStatusIcon("❌");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <main className="verify-page">
      <section className="verify-card">
        <div className="verify-card__icon">{statusIcon}</div>
        <h1 className="verify-card__title">Email verification</h1>
        <p className="verify-card__status">{status}</p>
        <p className="verify-card__hint">
          After verification, you'll be redirected to the login page automatically.
        </p>
        <div className="verify-card__actions">
          <button
            type="button"
            className="verify-card__button verify-card__button--primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
          {/* <button
            type="button"
            className="verify-card__button verify-card__button--secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button> */}
        </div>
      </section>
    </main>
  );
};

export default VerifyEmail;
