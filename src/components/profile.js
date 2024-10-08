import React, { useEffect, useState } from "react";
import style from "./../style/profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faKey, faCancel, faSave, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");
  const [error, setError] = useState();
  const [userDetail, setUserDetail] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Show modal
  const [tempUserDetail, setTempUserDetail] = useState({});
  const [otpSent, setOtpSent] = useState(false); // OTP state
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false); // Controls the sign-up modal
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  });
  let role = '';
  let currUser=localStorage.getItem('userId');
    if (token) {
        const decodedToken = jwtDecode(token);
        role = decodedToken.role;
    }
  
  const fetchUserDetails = async () => {
    try {
      if (id) {
        const response = await axios.get(
          `https://localhost:7023/api/User/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetail(response.data);
        setTempUserDetail(response.data);
      }
    } catch (err) {
      setError("Error fetching user details.");
      console.error(err);
    }
  };

  useEffect(() => {
    const inputFile = document.getElementById("input-file");
    const profilePic = document.getElementById("profile-pic");
    fetchUserDetails();

    inputFile.onchange = function () {
      const file = inputFile.files[0];
      if (file) {
        profilePic.src = URL.createObjectURL(file);
      }
    };
  }, []);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSignUpInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleSignUpSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    try {
      const response = await axios.post(`https://localhost:7023/api/User`, {
        ...newUser,
        role: "Admin", // Set default role to "Admin"
        registrationDate: new Date().toISOString(), // Set the registration date to the current date
      });
  
      if (response.status === 201) {
        alert("New user created successfully!");
        setIsSignUpModalOpen(false); // Close the modal
        setNewUser({ name: "", email: "", password: "", address: "", phoneNumber: "" }); // Reset the form
      }
    } catch (err) {
      console.error("Error creating new user:", err);
      alert("Error creating new user.");
    }
  };
    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUserDetail((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      if (id) {
        await axios.put(
          `https://localhost:7023/api/User/${id}`,
          tempUserDetail,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchUserDetails();
        setIsEditing(false);
      }
    } catch (err) {
      setError("Error saving user details.");
      console.error(err);
    }
  };

  const handleCancelClick = () => {
    setTempUserDetail(userDetail);
    setIsEditing(false);
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setOtpSent(false); // Reset OTP state
    setOtpVerified(false); // Reset OTP verification state
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `https://localhost:7023/api/User/request-otp?email=${encodeURIComponent(
          userDetail.email
        )}`
      );
      if (response.status === 200) {
        alert("OTP sent to your email.");
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `https://localhost:7023/api/User/verify-otp`,
        {
          email: userDetail.email,
          otp,
        }
      );
      if (response.status === 200) {
        alert("OTP verified successfully!");
        setOtpVerified(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        `https://localhost:7023/api/User/reset-password`,
        {
          email: userDetail.email,
          newPassword,
        }
      );
      if (response.status === 200) {
        alert("Password has been changed successfully.");
        setIsChangingPassword(false);
        setOtp("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password.");
    }
  };
  const profileImageUrl = role === 'Admin'
    ? "https://i.pinimg.com/474x/9c/bd/74/9cbd744294b488939adc6b861898117a.jpg"
    : "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg";


  return (  
      <div className={style["profile-container"]}>
    <div className={style["profile-pic"]}>
    <div className={style["sign-up-container"]}>
{role==='Admin' && (<button onClick={() => setIsSignUpModalOpen(true)} className={style["sign-up-button"]}>
   + Add New Admin
</button>)}
</div>
<Modal show={isSignUpModalOpen} handleClose={() => setIsSignUpModalOpen(false)}>
<div className={style["signup-form"]}>
  <h2>Sign Up New Admin</h2>
  <form onSubmit={handleSignUpSubmit}>
    <div>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={newUser.name}
        onChange={handleSignUpInputChange}
        required
      />
    </div>
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={newUser.email}
        onChange={handleSignUpInputChange}
        required
      />
    </div>
    <div>
      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={newUser.password}
        onChange={handleSignUpInputChange}
        required
      />
    </div>
    <div>
      <label>Address:</label>
      <input
        type="text"
        name="address"
        value={newUser.address}
        onChange={handleSignUpInputChange}
        required
      />
    </div>
    <div>
      <label>Phone Number:</label>
      <input
        type="text"
        name="phoneNumber"
        value={newUser.phoneNumber}
        onChange={handleSignUpInputChange}
        required
      />
    </div>
    <button type="submit" className={style["signup-button"]}>Create Admin</button>
  </form>
</div>
</Modal>
    </div>
      <div className={style["profile-container"]}>
  <div className={style["profile-pic-container"]}>
  <img
            src={profileImageUrl} // Use the profileImageUrl variable
            id="profile-pic"
            className={style["profile-pic"]}
            alt="profile"
          />
    <label htmlFor="input-file" className={style["upload-label"]}>
      Update Image
    </label>
    <input
      type="file"
      accept="image/jpeg, image/png, image/jpg"
      id="input-file"
      className={style["upload-input"]}
    />
  </div>
      <div className={style["user-details"]}>
        <div className={style["user-details-content"]}>
          <div>
            Name:{" "}
            {isEditing ? (
              <input
                name="name"
                value={tempUserDetail?.name || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userDetail?.name}</span>
            )}
          </div>
          <div>
            Email:{" "}
            {isEditing ? (
              <input
                name="email"
                value={tempUserDetail?.email || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userDetail?.email}</span>
            )}
          </div>
          <div>
            Address:{" "}
            {isEditing ? (
              <input
                name="address"
                value={tempUserDetail?.address || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userDetail?.address}</span>
            )}
          </div>
          <div>
            Phone Number:{" "}
            {isEditing ? (
              <input
                name="phoneNumber"
                value={tempUserDetail?.phoneNumber || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userDetail?.phoneNumber}</span>
            )}
          </div>
          <div>
            Registration Date: <span>{userDetail?.registrationDate}</span>
          </div>
          <div>
            Books Borrowed: <span>{userDetail?.bookCount}</span>
          </div>
        </div>
      </div>
      <div className={style["edit-container"]}>
        {isEditing ? (
          <>
            <div className={style["edit"]} onClick={handleSaveClick}>
            <FontAwesomeIcon icon={faSave} />
            Save
            </div>
            <div className={style["edit"]} onClick={handleCancelClick}>
            <FontAwesomeIcon icon={faCancel} />
            Cancel
            </div>
          </>
        ) : (
          <div className={style["edit"]} onClick={handleEditClick}>
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </div>
        )}
        <div className={style["edit"]} onClick={handleChangePasswordClick}>
          <FontAwesomeIcon icon={faKey} /> Change Password
        </div>
      </div>

      {/* Modal for changing password */}
      <Modal show={isChangingPassword} handleClose={() => setIsChangingPassword(false)}>
        <div className={style["password-change"]}>
          {!otpSent && (
            <button className={style["otp-button"]} onClick={handleSendOtp}>
              Send OTP to Email
            </button>
          )}
          {otpSent && !otpVerified && (
            <>
              <input
                className={style["otp-input"]}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <button className={style["otp-button"]} onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </>
          )}
          {otpVerified && (
            <>
              <input
                type="password"
                className={style["password-input"]}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
              />
              <button className={style["otp-button"]} onClick={handleChangePassword}>
                Change Password
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
    </div>
  );
};

export default Profile;
