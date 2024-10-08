import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./../style/signIn.module.css";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [account, setAccount] = useState(true); // true = login, false = sign up
  const [forgotPassword, setForgotPassword] = useState(false); // state for forgot password
  const [otpSent, setOtpSent] = useState(false); // state to track if OTP has been sent
  const [otpVerified, setOtpVerified] = useState(false); // state to track OTP verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // state for OTP input
  const [newPassword, setNewPassword] = useState(""); // state for new password input
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [role] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(account, "acc");
  }, [account]);

  // Toggle between login and signup
  const handleChange = (e) => {
    e.preventDefault();
    setAccount((prev) => !prev);
    setForgotPassword(false); // Reset forgot password state when switching between login/signup
    setOtpSent(false); // Reset OTP state
    setOtpVerified(false); // Reset OTP verification state
  };

  // Switch to forgot password state
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPassword(true); // Switch to forgot password state
  };

  // Back to login from forgot password
  const handleBackToLogin = (e) => {
    e.preventDefault();
    setForgotPassword(false); // Reset forgot password state
    setAccount(true); // Ensure it goes back to the login view
    setOtpSent(false); // Reset OTP state
    setOtpVerified(false); // Reset OTP verification state
  };

  // Handle form submission (login/signup)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (forgotPassword) {
      if (!otpSent) {
        // Send OTP to email
        try {
          const response = await axios.post(
            `https://localhost:7023/api/User/request-otp?email=${encodeURIComponent(
              email
            )}`
          );
          if (response.status === 200) {
            alert("OTP sent to your email.");
            setOtpSent(true); // Set OTP as sent
          }
        } catch (error) {
          console.error("Error sending OTP:", error);
          alert("Error sending OTP. Please try again.");
        }
      } else if (!otpVerified) {
        // Verify OTP
        try {
          const response = await axios.post(
            "https://localhost:7023/api/User/verify-otp",
            {
              email,
              otp,
            }
          );
          if (response.status === 200) {
            alert("OTP verified successfully!");
            setOtpVerified(true); // Set OTP as verified
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
          alert("Invalid OTP or OTP expired.");
        }
      } else {
        // Reset password
        try {
          const response = await axios.post(
            "https://localhost:7023/api/User/reset-password",
            {
              email,
              newPassword,
            }
          );
          if (response.status === 200) {
            alert("Password has been reset successfully.");
          }
        } catch (error) {
          console.error("Error resetting password:", error);
          alert("Error resetting password. Please try again.");
        }
      }
    } else if (account) {
      // Login logic
      try {
        const response = await axios.post(
          "https://localhost:7023/api/Auth/login",
          {
            email,
            password,
          }
        );
        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", response.data.userId);
          navigate("/dashboard");
          setEmail("");
          setPassword("");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response && error.response.status === 401) {
          alert("Invalid email or password. Please try again.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    } else {
      try {
        const response = await axios.post("https://localhost:7023/api/User", {
          name,
          email,
          password,
          address,
          phonenumber,
          registrationDate,
        });
        if (response.status === 201) {
          alert("Signup successful! You can now log in."); // Optional alert for feedback
          setAccount(true); // Switch to login view
          // Clear form fields after successful signup
          setName("");
          setEmail("");
          setPassword("");
          setAddress("");
          setPhonenumber("");
        }
      } catch (error) {
        console.error("Registration error:", error);
        if (error.response && error.response.status === 401) {
          alert("Invalid fields. Please try again.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <div className={style.side}>
          <div className={style["image-section"]}>
            <div className={style.section}>
              <div className={style["signin-container"]}>
                <div className={style.content}>
                  <div className={style.heading}>
                    {forgotPassword ? (
                      <div>
                        {otpSent
                          ? otpVerified
                            ? "Reset Password"
                            : "Verify OTP"
                          : "Reset Password"}
                      </div>
                    ) : account ? (
                      <div>Welcome!</div>
                    ) : (
                      <div>Sign Up</div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className={style.field}>
                    <div className={style["input-container"]}>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        type="email"
                        className={style["input-field"]}
                        required
                      />
                    </div>

                    {forgotPassword && otpSent && !otpVerified && (
                      <div className={style["input-container"]}>
                        <input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          type="text"
                          className={style["input-field"]}
                          required
                        />
                      </div>
                    )}

                    {forgotPassword && otpVerified && (
                      <div className={style["input-container"]}>
                        <input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          type="password"
                          className={style["input-field"]}
                          required
                        />
                      </div>
                    )}
                    {!account && !forgotPassword && (
                      <>
                        <div className={style["input-container"]}>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            type="text"
                            className={style["input-field"]}
                            required
                          />
                        </div>
                        <div className={style["input-container"]}>
                          <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            type="text"
                            className={style["input-field"]}
                            required
                          />
                        </div>
                        <div className={style["input-container"]}>
                          <input
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                            placeholder="Enter your mobile number"
                            type="text"
                            className={style["input-field"]}
                            required
                          />
                        </div>
                        
                      </>
                    )}

                    {!forgotPassword && (
                      <div className={style["input-container"]}>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          type="password"
                          className={style["input-field"]}
                          required
                        />
                      </div>
                    )}

                    {!forgotPassword && account && (
                      <div className={style["forgot-password"]}>
                        <a href="" onClick={handleForgotPassword}>
                          Forgot Password?
                        </a>
                      </div>
                    )}

                    <div className={style["button-container"]}>
                    <button type="submit" className={style["submit-button"]}>
                        {forgotPassword
                        ? otpVerified
                        ? "Reset Password"
                        : otpSent
                        ? "Verify OTP"
                        : "Send OTP" // This was added for when OTP hasn't been sent yet
                        : account
                        ? "Login"
                      : "Sign Up"}
                    </button>

                    </div>

                    <div className={style["login-page"]}>
                      {forgotPassword ? (
                        <div>
                          <a href="" onClick={handleBackToLogin}>
                            Back to Login
                          </a>
                        </div>
                      ) : account ? (
                        <div>
                          Not a member?{" "}
                          <a href="" onClick={handleChange}>
                            {" "}
                            Join
                          </a>
                        </div>
                      ) : (
                        <div>
                          Have an account?{" "}
                          <a href="" onClick={handleChange}>
                            Login
                          </a>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
