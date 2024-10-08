import React from 'react';
import style from "./../style/contact.module.css";

export default function Contact() {
  return (
    <div className={style["contact-container"]}>
      {/* Top Center Heading */}
      <h2 className={style["heading"]}>Contact Us</h2>

      {/* Contact Details */}
      <div className={style["details-container"]}>
        {/* Phone Number Container */}
        <div className={style["detail-box"]}>
          <h3>Phone Number</h3>
          <p>9382415290</p>
          <p>8667268910</p>
          <img src="https://media.istockphoto.com/id/1347843229/vector/a-persons-hand-with-mobile-phone-dialing-number.jpg?s=612x612&w=0&k=20&c=mImrcdX1J5Zw8zGrZuso4D19QRS3RBpmxIgHycC7vA4=" alt="Phone Icon" className={style["icon-image"]} />
        </div>

        {/* Address Container */}
        <div className={style["detail-box"]}>
          <h3>Address</h3>
          <address>21, Book Street,<br></br> CrossCut Nagar,<br></br>Chennai,<br></br>TamilNadu </address>
          <img src="https://cdn-icons-png.flaticon.com/512/6614/6614958.png" alt="Address Icon" className={style["icon-image"]} />
        </div>

        {/* Email Container */}
        <div className={style["detail-box"]}>
          <h3>Email</h3>
          <p>
            <a href="mailto:serenitylibrary@gmail.com" className={style["email-link"]}>
              serenitylibrary@gmail.com
            </a>
          </p>
          <img src="https://cdn.aarp.net/content/dam/aarp/home-and-family/personal-technology/2022/06/1140-emails-icon.jpg" alt="Email Icon" className={style["icon-image"]} />
        </div>
      </div>
    </div>
  );
}