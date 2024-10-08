import React from "react";
import style from "./../style/homeContent.module.css";
import SimpleImageSlider from "react-simple-image-slider";
import image1 from "./../assets/image1.jpg";
import image2 from "./../assets/image2.jpg";
import image3 from "./../assets/image3.jpg";
// import Service from "./service";
// import Rule from "./../assets/Rule.jpg";
// import Rule1 from "./../assets/Rule1.jpg";
import BGBanner from "./../assets/BGBanner.jpg";
import aboutus from "./../assets/aboutus.jpg";
// import artClasses from "./../assets/artClasses.jpg";
// import storytelling from "./../assets/Storytelling.jpg";
// import scienceClub from "./../assets/Scienceclub.jpg";
// import languageDevelopment from "./../assets/LanguageDevelopment.jpg";
// import meetingSpace from "./../assets/Meetingspace.jpg";
// import bookRental from "./../assets/bookrental.jpg";
import Footer from "./Footer";

const HomeContent = () => {
  const images = [{ url: image1 }, { url: image2 }, { url: image3 }];
  
  return(
    <div className={style["Banner"]}>
        <img src={BGBanner} alt="Banner Background"/>
        <div className={style["about-section"]}>
            <div className={style["about-text"]}>
                <h1>About Us</h1>
                <p>Established in 2015, Serenity Library is a rising generation of book reader’s community offering wonderful experiences for readers of all age groups with a wide collection of books; Serenity is much more than just a Library, with air-conditioned spaces dedicated to conducting workshops, storytelling sessions for children, and a conference room to host seminars, training programs, or quiet meetings.</p>
                <p>Serenity is a happening place for children, with opportunities for young enthusiasts willing to indulge in fun learning activities. With technology and gadgets replacing books, we proffer a place to cultivate an inclination towards book reading.</p>
            </div>
            <div className={style["about-image"]}>
                <img src={aboutus} alt="About Us - Family reading books"/>
            </div>
        </div>

        <h1>OUR BEST SELLER</h1>
        <div className={style["card-container"]}>
            <div className={style["card"]}>
                <div className={style["card-image"]}>
                    <img src={"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQpsHGnhKmN62SUYDaSIPnNb5zokUS_J7AjbzFU_RUYhzrAelhifTb7KfdW5Bk5EBQoArn8aJP2V0i1aRm_5KWIsE7bPS8uZv5IqbKEA70&usqp=CAE"} alt="The Missing Wife book cover"/>
                </div>
                <div className={style["card-content"]}>
                    <h3>The Missing Wife</h3>
                    <i>- by Sheila O'Flanagan</i>
                </div>
            </div>

            <div className={style["card"]}>
                <div className={style["card-image"]}>
                    <img src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRY7QDCuqviV-BNAX50LkplwfCdmfDslCTgAjmZQCk8Uj-pzjNyvwQfMdOC6bCIcOWrJWwnHtIuOv00oFdGoZfgxrotccXWSvoBFjU5vBCRc-EhY3SjIOXe8w&usqp=CAE" alt="November 9 book cover"/>
                </div>
                <div className={style["card-content"]}>
                    <h3>November 9</h3>
                    <i>- by Colleen Hoover</i>
                </div>
            </div>

            <div className={style["card"]}>
                <div className={style["card-image"]}>
                    <img src="https://m.media-amazon.com/images/I/91hBaZs2dQL._SY522_.jpg" alt="Till The Last Breath book cover"/>
                </div>
                <div className={style["card-content"]}>
                    <h3>Till The Last Breath</h3>
                    <i>- by Durjoy Datta</i>
                </div>
            </div>

            <div className={style["card"]}>
                <div className={style["card-image"]}>
                    <img src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcShq6zPxj2wBmIAv2g1DID294DvFu5iGnCu4tpp3xospQ87LXOhizyN751p3o1CGJaPe4jzkRpkJUJCnMcQgEIYUpei-Sk7rk9GQD5l8QFZ&usqp=CAE" alt="The Wager: A Tale of Shipwreck, Mutiny and Murder book cover"/>
                </div>
                <div className={style["card-content"]}>
                    <h3>The Wager: A Tale of Shipwreck, Mutiny and Murder</h3>
                    <i>- by David Grann</i>
                </div>
            </div>

            <div className={style["card"]}>
                <div className={style["card-image"]}>
                    <img src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRL3KkkPUQcxaMJfiPVzAJ_9NOOPrml4_73x8qFSMZ_ACNKCjieDlspyCDY-GRheWKo9WXZAbTSyRS-1VYYxnqX_pLsAOh-neVtW-OB1Zw&usqp=CAE" alt="Relentless book cover"/>
                </div>
                <div className={style["card-content"]}>
                    <h3>Relentless</h3>
                    <i>- by Tim Grover</i>
                </div>
            </div>

            <div className={style["card"]}>
                <div className={style["card-image"]}>
                    <img src="https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTlW8g7oP82RiQTKgxljlxq10hLLPVc5phSNIkeml_AFFHgvN_fHl7DggCteaHwF2gr2-6h2jGBILLhIFv9V4RH-NkRUM9fxz51I_Qb8e7CDWU05tEIgN5qVA&usqp=CAE" alt="Ashley Flowers book cover"/>
                </div>
                <div className={style["card-content"]}>
                    <h3>All Good People Here</h3>
                    <i>- by Ashley Flowers</i>
                </div>
            </div>
        </div>
        <Footer />
    </div>	
  );
};

export default HomeContent;
