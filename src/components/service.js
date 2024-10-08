import React from "react";
//import style from "./../style/service.module.css";
import image1 from "./../assets/Art class.jpg";
import aboutus from "./../assets/aboutus.jpg";
import artClasses from "./../assets/artClasses.jpg";
import storytelling from "./../assets/Storytelling.jpg";
import scienceClub from "./../assets/Scienceclub.jpg";
import languageDevelopment from "./../assets/LanguageDevelopment.jpg";
import meetingSpace from "./../assets/Meetingspace.jpg";
import bookRental from "./../assets/bookrental.jpg";
import style from "./../style/homeContent.module.css";
import aboutusBG from "./../assets/aboutusBG.jpg";


const Service = () => {
  return (
    <div>
        <div className={style["Banner"]}>
        <img src={aboutusBG}></img>
        </div>
            <h1>OUR SERVICES</h1>
            <div className={style["card-container"]}>
                <div className={style["card"]}>
                    <div className={style["card-image"]}>
                        <img src={bookRental} alt="Book Rental" />
                    </div>
                    <div className={style["card-content"]}>
                        <div className={style["icon"]}>📚</div>
                        <h3>Book Rental</h3>
                        <p>Borrow, read and return to borrow and read another. Serenity offers books on rent for all age groups and genres. Subscribe for a period and read as many books as you can.</p>
                    </div>
                </div>

                <div className={style["card"]}>
                    <div className={style["card-image"]}>
                        <img src={artClasses} alt="Art Classes" />
                    </div>
                    <div className={style["card-content"]}>
                        <div className={style["icon"]}>🎨</div>
                        <h3>Art Classes</h3>
                        <p>The art programme brings out artistic and creative potential in children, fostering their imagination and confidence.</p>
                    </div>
                </div>

                <div className={style["card"]}>
                    <div className={style["card-image"]}>
                        <img src={storytelling} alt="Storytelling" />
                    </div>
                    <div className={style["card-content"]}>
                        <div className={style["icon"]}>📖</div>
                        <h3>Storytelling</h3>
                        <p>Storytelling stimulates brain functioning, helping children develop empathy, communication, and interpersonal skills.</p>
                    </div>
                </div>

                <div className={style["card"]}>
                    <div className={style["card-image"]}>
                        <img src={scienceClub} alt="Science Club" />
                    </div>
                    <div className={style["card-content"]}>
                        <div className={style["icon"]}>🔬</div>
                        <h3>Science Club</h3>
                        <p>Science programmes help children build a scientific mindset and supplement classroom learning with practical understanding.</p>
                    </div>
                </div>

                <div className={style["card"]}>
                    <div className={style["card-image"]}>
                        <img src={languageDevelopment} alt="Language Development" />
                    </div>
                    <div className={style["card-content"]}>
                        <div className={style["icon"]}>📚</div>
                        <h3>Language Development</h3>
                        <p>Reading club and phonics-based programs help children develop language skills, including vocabulary and grammar growth.</p>
                    </div>
                </div>

                <div className={style["card"]}>
                    <div className={style["card-image"]}>
                        <img src={meetingSpace} alt="Meeting Space" />
                    </div>
                    <div className={style["card-content"]}>
                        <div className={style["icon"]}>🏢</div>
                        <h3>Meeting Space</h3>
                        <p>Serenity offers a conference room for seminars and training programs, providing a great ambiance at an affordable price.</p>
                    </div>
                </div>
            </div>
        </div>
  );
};
export default Service;