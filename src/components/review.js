import React, { useEffect, useState } from "react";
import style from './../style/review.module.css';
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Change this import to default import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faTrash } from "@fortawesome/free-solid-svg-icons"; 

const Review = () => {
  const token = localStorage.getItem("token");
  let role = "";
  const currUserId = localStorage.getItem('userId'); // Fetching the current user ID from localStorage

  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role;
  }

  const [error, setError] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    BookID: "",
    UserID: currUserId || "", // Set UserID to the current user ID from localStorage
    description: "",
    rating: "",
  });
  const [reviews, setReviews] = useState([]);
  const [allBooks, setAllBooks] = useState([]); // State to store all books

  useEffect(() => {
    fetchReview();
    fetchAllBooks(); // Fetch all books on component mount
  }, []);

  const fetchReview = async () => {
    try {
      const response = await axios.get("https://localhost:7023/api/Review", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
    } catch (err) {
      setError("Error fetching reviews.");
      console.error(err);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get('https://localhost:7023/api/Book', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setAllBooks(response.data); // Assuming response.data contains the list of books
    } catch (error) {
      console.error("Error fetching all books: ", error);
      setError("Error fetching books.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7023/api/Review/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReview();
    } catch (err) {
      setError("Error deleting review.");
      console.error(err);
    }
  };

  const handleNewReview = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReview = async () => {
    try {
      await axios.post("https://localhost:7023/api/Review", newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPopupOpen(false);
      setNewReview({
        BookID: "",
        UserID: currUserId || "",
        description: "",
        rating: "",
      });
      fetchReview();
    } catch (err) {
      setError("Error adding review.");
      console.error(err);
    }
  };

  return (
    <div className={style['review-container']}>
      {role === "User" && (
        <div className={style["add-container"]}>
          <div className={style.add} onClick={() => setIsPopupOpen(true)}>
            + &nbsp; Add
          </div>
        </div>
      )}
      <div className={style['review-content']}>
        {reviews.map((data, index) => (
          <div
            key={index}
            className={`${style['review-box']} ${style[`rating-${data.rating}`]}`}
          >
            <div>Book : {data.bookTitle}</div>
            <div>Description : {data.description}</div>
            <div>Ratings : {data.rating}</div>
            <div>Date : {data.reviewDate}</div>
            {role === "Admin" && (
              <div
                style={{ width: "80px" }}
                className={style["add"]}
                onClick={() => handleDelete(data.reviewID)}
              >
                <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete
              </div>
            )}
          </div>
        ))}
      </div>
      {isPopupOpen && (
        <div className={style.popup}>
          <div className={style.popupContent}>
            <h2>Add New Review</h2>
            <div>
              {/* Dropdown for selecting a book */}
              <select
                style={{ width: "100%", height: "35px" }}
                name="BookID"
                value={newReview.BookID}
                onChange={handleNewReview}
              >
                <option value="">Select a Book</option>
                {allBooks.map((book) => (
                  <option key={book.bookID} value={book.bookID}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                style={{ width: "100%" }}
                placeholder="Description"
                name="description"
                value={newReview.description}
                onChange={handleNewReview}
              />
            </div>
            <div>
              <input
                style={{ width: "100%", height: "35px" }}
                placeholder="Rating"
                type="number"
                name="rating"
                value={newReview.rating}
                onChange={handleNewReview}
                min="1"
                max="5" // Assuming rating is on a scale of 1-5
              />
            </div>
            <div className={style["add"]} onClick={handleAddReview}>
              Add Review
            </div>
            <div className={style["add"]} onClick={() => setIsPopupOpen(false)}>
              Cancel
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
