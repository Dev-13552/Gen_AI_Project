import React, { useState, useRef, useEffect, useContext } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { Link, useNavigate } from "react-router";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { AuthContext } from "../../auth/auth.context.jsx";
import { toast } from "sonner";
import { getMe, logout } from "../../auth/services/auth.api.js";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Loader from "../../auth/components/Loader.jsx";
import userLogo from '../../../userLogo.png'


const Home = () => {
  const { loading, generateReport, reports, setLoading } = useInterview();
  const context = useContext(AuthContext);
  const { user, setUser } = context;
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [isArrowUp, setIsArrowUp] = useState(true);
  const resumeInputRef = useRef();
  const [resumeFileName, setResumeFileName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    if(!jobDescription || (!selfDescription && !resumeFile) ){
      toast.error("Please fill the required fields");
      return;
    }
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    navigate(`/interview/${data._id}`);
  };

  const handleClick = () => {
    setIsArrowUp((prev) => !prev);
  };
  const handleLogout = async () => {
    try {
      const data = await logout();
      setUser(null);
      toast.success("User Logged Out Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Some error Occurred while logging out");
    } finally {
    }
  };

  const handlePayment = async () => {
    setShowModal(false)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/create-order`,
        {},
        { withCredentials: true },
      );

      if (!data.success) return toast.error("Something went wrong");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: "Resume-generator",
        description: "Order payment",
        amount: 50000,
        currency: "INR",
        order_id: data.response.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/api/auth/verify-payment`,
              response,
              {
                withCredentials: true,
              },
            );

            if (verifyRes.data.success) {
              toast.success(`✅${verifyRes.data.message}`);
              console.log(verifyRes.data.user);
              setUser(verifyRes.data.user);
              navigate("/");
            } else {
              toast.error("❌Payment Verification Failed!");
            }
          } catch (error) {
            console.log(error.message);
            toast.error("Error verifying payment");
          }
        },
        modal: {
          ondismiss: async function () {
            await axios.post(
              `${import.meta.env.VITE_URL}/api/auth/verify-payment`,
              {
                paymentFailed: true,
              },
              {
                withCredentials: true,
              },
            );
            toast.error("Payment Cancelled or Failed");
          },
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: { color: "#F47286" },
      };

      const rzp = new window.Razorpay(options);

      // Listen for payment failures
      rzp.on("payment.failed", async function (response) {
        await axios.post(
          `${import.meta.env.VITE_URL}/api/auth/verify-payment`,
          {
            paymentFailed: true,
          },
          {
            withCredentials: true,
          },
        );
        toast.error("Payment Failed. Please try again");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing payment");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <Loader loading={loading}/>
      </main>
    );
  }


  return (
    <div className="home-page">
      {/* side box */}
      <div className="sidebar-menu">
        <button className="sidebar-toggle" onClick={() => handleClick()}>
          <img src={user.profilePic  || userLogo} alt="Profile" height={20} width={20} />
          {isArrowUp ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>

        {!isArrowUp && (
          <div className="sidebar-dropdown">
            <div className="sidebar-user">
              <img src={user.profilePic || userLogo} alt="Profile" height={24} width={24} />
              <p className="sidebar-username">{user.username}</p>
            </div>

            <div className="sidebar-divider" />
            <Link to={`/user/${user._id}`} className="sidebar-link">
              <CgProfile />
              <p>Profile</p>
            </Link>

            <button
              className="sidebar-link sidebar-logout"
              onClick={handleLogout}
            >
              <IoIosLogOut />
              <p>Logout</p>
            </button>
          </div>
        )}
      </div>

      {/* Modal Page */}
      <div className="modal-holder">
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                onClick={() => setShowModal(false)}
                className="modal__close"
              >
                ×
              </button>

              <h2 className="modal__title">Upgrade to Pro Model</h2>

              <p className="modal__description">
                Unlock advanced AI features for personalized interviews and
                more. With the Pro Model, you can also download your
                AI-generated resume instantly.
              </p>

              <div className="modal__buttons">
                <button className="btn btn--primary" onClick={handlePayment}>
                  Purchase Pro Model - ₹500
                </button>

                <button
                  className="btn btn--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Not Interested
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Page Header */}

      <header className="page-header">
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
        <button
          onClick={() => {if(user.status == "Paid"){toast.success("You already have the pro version"); return;} {setShowModal(true)}}}
          className="button primary-button btn"
        >
          Get Pro
        </button>
      </header>

      {/* Main Card */}
      <div className="interview-card">
        <div className="interview-card__body">
          {/* Left Panel - Job Description */}
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              className="panel__textarea"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={5000}
            />
            <div className="char-counter">0 / 5000 chars</div>
          </div>

          {/* Vertical Divider */}
          <div className="panel-divider" />

          {/* Right Panel - Profile */}
          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2>Your Profile</h2>
            </div>

            {/* Upload Resume */}
            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>
              <label className="dropzone" htmlFor="resume">
                <span className="dropzone__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </span>
                <p className="dropzone__title">
                  Click to upload or drag &amp; drop
                </p>
                <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                {resumeFileName && (
                  <p className="dropzone__file-name">Selected file: {resumeFileName}</p>
                )}
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setResumeFileName(file ? file.name : "");
                  }}
                />
              </label>
            </div>

            {/* OR Divider */}
            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Quick Self-Description */}
            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            {/* Info Box */}
            <div className="info-box">
              <span className="info-box__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>
          <button onClick={handleGenerateReport} className="generate-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Position"}</h3>
                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page Footer */}
      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default Home;
