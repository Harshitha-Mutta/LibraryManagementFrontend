import React from 'react';
import style from "./../style/rules.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons'; // Import the book icon

export default function Rules(){
    return (
        <div className={style["container"]}>
      <div className={style["left-section"]}>
        {/* You can replace the src attribute with the path to your image */}
        <img src="https://www.ies.edu/titwala/img/rules_regulations.jpeg" alt="Books" className={style["book-image"]} />
      </div>
      <div className={style["right-section"]}>
        <h2>Library Rules</h2>
        <ul>
          <li><strong>Respect Silence:</strong> Maintain a quiet atmosphere. Conversations should be kept to a minimum, and phone calls should be taken outside.</li>
          <li><strong>Handle Books with Care:</strong> Avoid writing on, tearing, or damaging the books in any manner.</li>
          <li><strong>Food and Drink:</strong> Food and drinks are not allowed inside the library to maintain cleanliness.</li>
          <li><strong>Respect Others:</strong> Allow others to study and work undisturbed. Avoid disruptive behavior, such as loud music or chatting.</li>
          <li><strong>Borrowing Limit:</strong> Each member is allowed to borrow a maximum of 5 books at a time.
          </li>
          <li><strong>Return Period:</strong>Books must be returned within 10 days of borrowing. Extensions can be requested but are subject to availability.</li>
          <li><strong>Late Return Fine: </strong> A fine of ₹5 per day will be charged for books not returned by the due date.</li>
          
        </ul>
      </div>
    </div>
      );
}

