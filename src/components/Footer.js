import React, { useState } from "react";
import style from "./../style/footer.module.css"; // Ensure this path is correct.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  // State to manage modal visibility and content
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Function to handle opening the modal with the respective content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className={style["footer"]}>
        <div className={style["footer-content"]}>
          <div className={style["footer-section about"]}>
            <h2>Serenity Library</h2>
            <p>
              <span 
                onClick={() => openModal("most-asked-questions")} 
                className={style.link}
              >
                Most Asked Questions
              </span>{" "}
              |{" "}
              <span 
                onClick={() => openModal("company-policy")} 
                className={style.link}
              >
                Company Policy
              </span>
            </p>
          </div>

          <div className={style["footer-section social"]}>
            <h2>Follow Us</h2>
            <div className={style["social-icons"]}>
              <a 
                href="https://www.instagram.com/mrbean" 
                target="_blank" 
                rel="noopener noreferrer"
                className={style.icon}
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a 
                href="https://twitter.com/mrbean" 
                target="_blank" 
                rel="noopener noreferrer"
                className={style.icon}
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a 
                href="https://www.youtube.com/user/mrbean" 
                target="_blank" 
                rel="noopener noreferrer"
                className={style.icon}
              >
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </a>
            </div>
          </div>
        </div>
        <div className={style["footer-bottom"]}>
          <p>&copy; 2024 Serenity Library | All rights reserved</p>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <span className={style.closeModal} onClick={closeModal}>
              &times;
            </span>
            <h2>
              {modalContent === "most-asked-questions" ? "Most Asked Questions" : "Company Policy"}
            </h2>
            <p>
              {modalContent === "most-asked-questions"
                ? " 1.How can I reserve a book?\nYou can reserve book online via the library's catalog or by calling the Admin.\n 2.Can I print, copy, or scan documents at the library?\nYes, printing, copying, and scanning services are available. Ask staff for assistance if needed.\n3.Where can I find books on a specific topic?\nUse the library’s online catalog or ask a librarian for help finding books on your topic.\n4. How can I register ?\nVisit the library ask Admin or Librarian  to register you up or you can register in our website"
                : "\nOur company is committed to providing the best service to our readers. All policies are available in our terms and conditions.\n\nHarassment, disruptive behavior, and the misuse of library equipment, including the website, are strictly prohibited and may result in suspension of privileges."}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
