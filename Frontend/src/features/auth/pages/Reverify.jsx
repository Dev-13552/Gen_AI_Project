import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { toast } from "sonner";

const Reverify = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_URL}/api/auth/reverify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reverification failed");
      }

      toast.success("Verification email sent successfully!");
      navigate("/verify");
    } catch (error) {
      toast.error(error.message || "Reverification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1>Reverify Email</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
          </div>
          <button 
            className="button primary-button" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Verification"}
          </button>
        </form>
        <p>
          Already Verified? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Reverify;
