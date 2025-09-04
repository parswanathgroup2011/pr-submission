import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5002/api/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);

      if (response.data.success) {
        navigate("/reset-password", { state: { email } });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-container">
      <h2 className="forgot-title">Forgot Password</h2>
      <form onSubmit={handleSendOtp} className="forgot-form">
        <input
          type="email"
          placeholder="Enter your email"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="forgot-button">Send OTP</button>
      </form>
      {message && <p className="forgot-message success">{message}</p>}
      {error && <p className="forgot-message error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
