import style from "./../style/timings.module.css";
import React from 'react';

export default function Timings() {
  return (
    <div className={style["timings-container"]}>
      {/* Top Center Heading */}
      {/* Left side: Image */}
      <div className={style["left-side"]}>
        <img 
          src="https://timewellscheduled.com/wp-content/uploads/2021/06/AdobeStock_403681054-scaled.jpeg" 
          alt="Flexible Working Hours" 
          className={style["timing-image"]}
        />
      </div>

      {/* Right side: Timings Content */}
      <div className={style["right-side"]}>
        <div className={style["timing-category"]}>
          <h3>Weekdays (Monday - Friday)</h3>
          <div className={style.book}>
            <span>9:00 AM - 6:00 PM</span>
          </div>
        </div>

        <div className={style["timing-category"]}>
          <h3>Weekends (Saturday & Sunday)</h3>
          <div className={style.book}>
            <span>9:00 AM - 4:00 PM</span>
          </div>
        </div>

        <div className={style["timing-category"]}>
          <h3>National Holidays</h3>
          <p>Closed on all National Public Holidays</p>
          <div className={style.book}>
            <span>Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

