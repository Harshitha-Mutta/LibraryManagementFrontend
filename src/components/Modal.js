import React from "react";
import style from "./../style/modal.module.css";

const Modal = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className={style["modal-overlay"]}>
      <div className={style["modal-content"]}>
        <button className={style["modal-close"]} onClick={handleClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
