import style from "./../style/borrow.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory,faClipboardCheck, faTrashAlt,faCheckSquare,faQuestionCircle,faCheckCircle,faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showBorrowReservedModal, setShowBorrowReservedModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false); // New state for search modal
  const [showViewHistoryModal, setShowViewHistoryModal] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [BorrowDate, setBorrowDate] = useState("");
  const [searchType, setSearchType] = useState("user");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [currentPageHistory, setCurrentPageHistory] = useState(1); // For history modal pagination
  const [recordsPerPageHistory] = useState(5); // Set number of records per page for history modal
  const [error, setError] = useState(null);
  const [itemsPerPage] = useState(5);
  const [userborrowedBooks, setuserBorrowedBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]); // State for available books
  const [allBooks, setAllBooks] = useState([]);
  const [unavailableBooks, setUnavailableBooks] = useState([]);
  const [showPreBookingModal,setShowPreBookingModal]=useState(false);
  const [showCancelPreBookingModal, setShowCancelPreBookingModal] = useState(false);
  const [showApproveBooking, setShowApproveBooking]=useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [reserveEmails, setReserveEmails] = useState([]);
  const [allUsers1, setAllUsers1] = useState([]);
  
  
  const token = localStorage.getItem("token");
  let role = '';
  let currUser=localStorage.getItem('userId');
    if (token) {
        const decodedToken = jwtDecode(token);
        role = decodedToken.role;
    }
    const reserveUserEmails = async () => {
    try {
      const response = await axios.get('https://localhost:7023/api/Reservation/ApprovedEmails', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add authorization header if needed
        },
      });
      console.log('API Response for rerevdApprove mails:', response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setReserveEmails(response.data); // Set fetched emails and user IDs
      } else {
        setReserveEmails([]); // Empty array if no emails are found
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };
    const fetchUserEmails = async () => {
      try {
        const response = await axios.get("https://localhost:7023/api/BorrowedBook/UnreturnedBooks/Emails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Check if response data is an empty array and set state accordingly
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAllUsers(response.data); // Set user emails if available
        } else {
          setAllUsers([]); // Set to empty array if no users found
        }
        
        console.log("All users", allUsers); // This may not reflect the updated state immediately due to React's asynchronous nature.
      } catch (error) {
        console.error("Error fetching user emails:", error.response ? error.response.data : error.message);
        
      }
    };
    
    const fetchAllBooks = async () => {
      try {
        const response = await axios.get('https://localhost:7023/api/Book',
          {
            headers: { 'Authorization': `Bearer ${token}` },
          });
        setAllBooks(response.data);  // Assuming response.data contains the list of books
      } catch (error) {
        console.error("Error fetching all books: ", error);
      }
    };
    const fetchUnavailableBooks = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token if required for authorization
        const response = await axios.get('https://localhost:7023/api/Book/notavailable', {
          headers: {
            'Authorization': `Bearer ${token}`, // Add authorization header if needed
          },
        });
        setUnavailableBooks(response.data); // Assuming response.data contains the list of unavailable books
      } catch (error) {
        console.error("Error fetching unavailable books: ", error);
      }
    };
    const handlePreBooking = async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
    
      if (!bookId || !currUser || !token) {
        alert("Please provide valid Book ID, User ID, and Token");
        return;
      }
    
      try {
        await axios.post(
          `https://localhost:7023/api/BorrowedBook/prebooking?bookId=${bookId}&userId=${currUser}`,
          {}, // Empty body if not required
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Book pre-booked successfully");
        setShowPreBookingModal(false); // Close the modal after successful pre-booking
      } catch (error) {
        console.error("Error pre-booking the book", error);
        alert("Failed to pre-book the book. Please try again.");
      }
    };
    
    const handleCancelPreBooking = async () => {
      if (!bookId || !currUser) {
        alert("Please select a book to cancel the pre-booking.");
        return;
      }
    
      try {
        await axios.post(
          `https://localhost:7023/api/BorrowedBook/cancel-prebooking?bookId=${bookId}&userId=${currUser}`,
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Pre-booking canceled successfully");
        setShowCancelPreBookingModal(false); // Close the modal after cancellation
      } catch (error) {
        console.error("Error canceling pre-booking:", error);
        alert("Failed to cancel pre-booking. Please try again.");
      }
    };
    const handleApproveBook=async() => {
      if (!bookId || !currUser || !userId) {
        alert("Please select a book to cancel the pre-booking.");
        return;
      }
    
      try {
        await axios.post(
          `https://localhost:7023/api/BorrowedBook/approve-prebooking?bookId=${bookId}&userId=${userId}`,
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Booking Approved Successfully");
        setShowApproveBooking(false); // Close the modal after cancellation
      } catch (error) {
        console.error("Error Approving pre-booking:", error);
        alert("Failed to Approve pre-booking. Please try again.");
      }
    };
    useEffect(() => {
      const fetchUserBorrowedBooks = async () => {
        if (currUser) {
          try {
            const response = await axios.get(`https://localhost:7023/api/BorrowedBook/user/${currUser}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            if (response.data && response.data.length > 0) {
              setuserBorrowedBooks(response.data); // Store the fetched data
              console.log(response.data);
            } else {
              setuserBorrowedBooks([]); // Set to an empty array if no books are borrowed
              console.log('No borrowed books found.');
            }
          } catch (err) {
            setError('Failed to fetch borrowed books.'); // Handle error
          }
        }
      };
      reserveUserEmails();
      approveEmails(); 
      fetchUserEmails();
      fetchUnavailableBooks();
      fetchUserBorrowedBooks(); 
      fetchAvailableBooks();
      fetchAllBooks();
      console.log(role);
      console.log(currUser);
      
    }, [currUser]);
    
    
    const approveEmails = async () => {
      try {
        const response = await axios.get('https://localhost:7023/api/BorrowedBook/SameDate', {
          headers: {
            'Authorization': `Bearer ${token}`, // Add authorization header if needed
          },
        });
        setAllUsers1(response.data); // Store the fetched users
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAllUsers1(response.data); // Set user emails if available
        } else {
          setAllUsers1([]); // Set to empty array if no users found
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };  
  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get(`https://localhost:7023/api/BorrowedBook`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setBorrowedBooks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching borrowed books", error);
    }
  };
  const fetchAvailableBooks = async () => {
    try {
        const response = await axios.get('https://localhost:7023/api/Book/available', {
          headers: { 'Authorization': `Bearer ${token}` },
        }); 
        setAvailableBooks(response.data); // Store the available books in state
    } catch (error) {
        console.error('Error fetching available books:', error);
    }
};

  const fetchBorrowedBooksByType = async () => {
    try {
      const url = searchType === "user"
        ? `https://localhost:7023/api/BorrowedBook/user/${userId}`
        : `https://localhost:7023/api/BorrowedBook/book/${bookId}`;
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.data && response.data.length > 0) {
        // If data exists, update the search results
        setSearchResults(response.data);
      } else {
        // If no data is found, alert the user and clear the search results
        setSearchResults([]);
        alert("No records found for the given search criteria.");
      }
    } catch (error) {
      console.error('Error fetching borrowed books:', error.response ? error.response.data : error.message);
      setSearchResults([]);
      // alert("Error occurred while fetching data.");

    }
  };

  const handleSearch = () => {
    fetchBorrowedBooksByType();
    setShowSearchModal(true);  // Show the search modal
  };
  const handleViewHistory = () => {
    console.log("View History");
    fetchBorrowedBooks(); // Call the fetch function to get all borrowed books
    setShowViewHistoryModal(true);  // Show the search modal (if needed)
  };
  const handleBorrowBook = async () => {
    if (!userId || !bookId) {
      alert("Please provide both User ID and Book ID");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7023/api/BorrowedBook",
        { userID: Number(userId), bookID: Number(bookId), borrowDate: BorrowDate },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      alert("Book borrowed successfully");
      setUserId("");
      setBookId("");
      setBorrowDate("");
      fetchBorrowedBooks();
      setShowBorrowModal(false);
    } catch (error) {
      console.error('Error fetching borrowed books:', error.response ? error.response.data : error.message);
    }
  };

  const handleBorrowReservedBook = async () => {
    if (!userId || !bookId) {
      alert("Please provide both User ID and Book ID");
      return;
    }
    console.log("Borrowing book with payload:", {
      userID: Number(userId),
      bookID: Number(bookId),
  });
    try {
      await axios.post(
        "https://localhost:7023/api/BorrowedBook/borrow-reserved-book",
        { userID: Number(userId), bookID: Number(bookId) },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      alert("Reserved book borrowed successfully");
      fetchBorrowedBooks();
      setShowBorrowReservedModal(false);
    } catch (error) {
      console.error("Error borrowing reserved book", error);
    }
  };

  const handleReturnBook = async () => {
    if (!userId || !bookId || !returnDate) {
      alert("Please provide User ID, Book ID, and Return Date");
      return;
    }

    try {
      await axios.put(
        `https://localhost:7023/api/BorrowedBook/ReturnBorrowedBook`,
        {
          userID: Number(userId),
          bookID: Number(bookId),
          returnDate: returnDate,
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      alert("Book returned successfully");
      setUserId("");
    setBookId("");
    setReturnDate("");
      fetchBorrowedBooks();
      setShowReturnModal(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Error: The book or user ID does not exist or has not been borrowed.");
    } else {
        console.error('Error fetching borrowed books:', error.response ? error.response.data : error.message);
        alert("An error occurred while returning the book. Please try again.");
    }
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = searchResults.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(searchResults.length / recordsPerPage);

  const indexOfLastHistoryRecord = currentPageHistory * recordsPerPageHistory;
  const indexOfFirstHistoryRecord = indexOfLastHistoryRecord - recordsPerPageHistory;
  const currentHistoryRecords = borrowedBooks.slice(indexOfFirstHistoryRecord, indexOfLastHistoryRecord);
  const totalHistoryPages = Math.ceil(borrowedBooks.length / recordsPerPageHistory);
  const totalPages1 = Math.ceil(userborrowedBooks.length / itemsPerPage);

  // Get current books for the current page
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = userborrowedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const renderBorrowStatus = (status) => {
    switch (status) {
        case 'BookingSuccess':
            return <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />;
        case 'Cancelled':
            return <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />;
        case 'BookingAllocated':
            return <FontAwesomeIcon icon={faCheckSquare} style={{ color: 'blue' }} />;
        default:
            return <FontAwesomeIcon icon={faQuestionCircle} title="Not Applicable" />;
    }
};

  return (
    
    <div className={style["borrowed-books-container"]}>
      <div className="button-container">
      {role !== 'Admin' && (
        <button className={style["pre-book-button"]} onClick={() => setShowPreBookingModal(true)}>
          <FontAwesomeIcon icon={faClipboardCheck} style={{ marginRight: '5px' }} />
        Pre-book a Book
        </button>
      )}
       {role !== 'Admin' && (
    <button  className={style["cancel-pre-booking-button"]} onClick={() => setShowCancelPreBookingModal(true)}>
       <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '5px' }} />
      Cancel Pre-booking</button>
        )}
      </div>
      {role==='Admin' && (<div onClick={handleViewHistory} className={style["history-button-container"]}>
      <button className={style["history-button"]}>
        <FontAwesomeIcon icon={faHistory} /> History
      </button>
    </div>)}
      {role === 'User' && (
        <div>
          <h2>Borrowed Books</h2>
          {error && <p className={style.error}>{error}</p>}
          {userborrowedBooks.length > 0 ? (
            <table className={style.table}>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((borrowedBook) => (
                  <tr key={borrowedBook.id}>
                    <td>{borrowedBook.bookTitle}</td>
                    <td>{borrowedBook.borrowDate}</td>
                    <td>{borrowedBook.dueDate}</td>
                    <td>{borrowedBook.returnDate || 'Not Returned Yet'}</td>
                    <td>{renderBorrowStatus(borrowedBook.borrowStatus || 'Not-Applicable')}{borrowedBook.borrowStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No borrowed books found.</p>
          )}

          {/* Pagination Controls */}
          {userborrowedBooks.length > itemsPerPage && (
            <div className={style.pagination}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages1}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Search bar with dropdown */}
      {role==='Admin' && (<div className={style["search-container"]}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="user">User ID</option>
          <option value="book">Book ID</option>
        </select>
        <input
          type="text"
          value={searchType === "user" ? userId : bookId}
          onChange={(e) => searchType === "user" ? setUserId(e.target.value) : setBookId(e.target.value)}
          placeholder={searchType === "user" ? "Enter User ID" : "Enter Book ID"}
        />
        <button onClick={handleSearch} className={style["search-button"]}>Search</button>
      </div>)}

      {/* Other Cards Layout */}
      {role==='Admin' && (<div className={style["cards-container"]}>
        <div className={style["card"]}>
          <h3>Borrow Book</h3>
          <p>Click to borrow a book</p>
          <button onClick={() => setShowBorrowModal(true)} className={style["action-button"]}>
            Borrow Book
          </button>
        </div>

        <div className={style["card"]}>
          <h3>Borrow Reserved Book</h3>
          <p>Click to borrow a reserved book</p>
          <button onClick={() => setShowBorrowReservedModal(true)} className={style["action-button"]}>
            Borrow Reserved Book
          </button>
        </div>

        <div className={style["card"]}>
          <h3>Return Book</h3>
          <p>Click to return a book</p>
          <button onClick={() => setShowReturnModal(true)} className={style["action-button"]}>
            Return Book
          </button>
        </div>
        <div className={style["card"]}>
          <h3>Pre-Booking</h3>
          <p>Click to borrow Pre-Booking</p>
          <button onClick={()=>setShowApproveBooking(true)} className={style["action-button"]}>Pre-Booking Book</button>
        </div>
      </div>)}
      
      {/* Borrow Modal */}
      {showBorrowModal && (
  <div className={style.modal}>
    <h3>Borrow Book</h3>
    <label>
      User ID:
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
      />
    </label>
    <label>
      Book ID:
      <select
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        required
      >
        <option value="">Select a Book</option>
        {availableBooks.length === 0 ? (
          <option>No available books</option>
        ) : (
          availableBooks.map(book => (
            <option key={book.bookID} value={book.bookID}>
              {book.title} {/* Display book title or any other attribute */}
            </option>
          ))
        )}
      </select>
    </label>
    <label>
      Borrow Date:
      <input
        type="date"
        value={BorrowDate}
        onChange={(e) => setBorrowDate(e.target.value)}
      />
    </label>
    <button onClick={handleBorrowBook}>Borrow</button>
    <button onClick={() => setShowBorrowModal(false)}>Cancel</button>
  </div>
)}

      {showBorrowReservedModal && (
        <div className={style.modal}>
          <h3>Borrow Reserved Book</h3>
          <label>
        User Email:
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">Select a user</option>
          {reserveEmails.length > 0 ? (
            reserveEmails.map((user) => (
              <option key={user.userID} value={user.userID}>
                {user.email} {/* Display the email as the option text */}
              </option>
            ))
          ) : (
            <option value="">No users found</option> // Show if no users are available
          )}
        </select>
      </label>
          <label>
      Book ID:
      <select
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        required
      >
        <option value="">Select a Book</option>
        {unavailableBooks.length === 0 ? (
          <option>No Unavailable books</option>
        ) : (
          unavailableBooks.map(book => (
            <option key={book.bookID} value={book.bookID}>
              {book.title} {/* Display book title or any other attribute */}
            </option>
          ))
        )}
      </select>
    </label>
          <button onClick={handleBorrowReservedBook}>Borrow Book</button>
          <button onClick={() => setShowBorrowReservedModal(false)}>Cancel</button>
        </div>
      )}
      {/* Return Modal */}
      {showReturnModal && (
        <div className={style.modal}>
          <h3>Return Book</h3>
          <label>
  User Email:
  <select value={userId} onChange={(e) => setUserId(e.target.value)}>
    <option value="">Select a user</option>
    {allUsers.length > 0 ? (
      allUsers.map((user) => (
        <option key={user.userID} value={user.userID}>
          {user.email} {/* Display the email as the option text */}
        </option>
      ))
    ) : (
      <option value="">No users found</option> // Option to indicate no users found
    )}
  </select>
</label>

        <label>
  Book ID:
  <select
    value={bookId}
    onChange={(e) => setBookId(e.target.value)}
  >
    <option value="">Select a book</option> {/* Default option */}
    {allBooks.map((book) => (
      <option key={book.bookID} value={book.bookID}> {/* Adjust the value according to your book ID field */}
        {book.title} {/* Display the title of the book */}
      </option>
    ))}
  </select>
</label>
<label>
  Return Date:
  <input
    type="date"
    value={returnDate}
    onChange={(e) => setReturnDate(e.target.value)}
  />
</label>
          {console.log("return Date",returnDate)};
          <button onClick={handleReturnBook}>Return</button>
          <button onClick={() => setShowReturnModal(false)}>Cancel</button>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
  <div className={style["history-modal"]}>
    <h3>Search Results</h3>

    {/* Check if currentRecords is empty */}
    {currentRecords.length === 0 ? (
      <div className={style.error}>
        <p>No records found for the given search criteria.</p>
      </div>
    ) : (
      <div className={style["table-container"]}>
        <table className={style["history-table"]}>
          <thead>
            <tr>
              {searchType === "user" ? (
                <>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                </>
              ) : (
                <>
                  <th>User</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((borrowedBook) => (
              <tr key={borrowedBook.id}>
                {searchType === "user" ? (
                  <>
                    <td>{borrowedBook.bookTitle}</td>
                    <td>{new Date(borrowedBook.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(borrowedBook.dueDate).toLocaleDateString()}</td>
                    <td>{borrowedBook.returnDate 
                          ? new Date(borrowedBook.returnDate).toLocaleDateString() 
                          : "Not Returned Yet"}
                    </td>
                  </>
                ) : (
                  <>
                    <td>{borrowedBook.userName}</td>
                    <td>{new Date(borrowedBook.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(borrowedBook.dueDate).toLocaleDateString()}</td>
                    <td>{borrowedBook.returnDate 
                          ? new Date(borrowedBook.returnDate).toLocaleDateString() 
                          : "Not Returned Yet"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Pagination Controls */}
    {currentRecords.length > 0 && (
      <div className={style.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    )}
    
    <button onClick={() => setShowSearchModal(false)} className={style["close-button"]}>Close</button>
  </div>
)}

 {showViewHistoryModal && (
  <div className={style["history-modal"]}>
    <h3>Borrowed Book History</h3>
    <div className={style["table-container"]}>
      {/* Table Header */}
      <table className={style["history-table"]}>
        <thead>
          <tr>
            <th>UserName</th>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Booking Status</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {currentHistoryRecords.map((borrowedBook) => (
            <tr key={borrowedBook.id}>
              <td>{borrowedBook.userName}</td>
              <td>{borrowedBook.bookTitle}</td>
              <td>{borrowedBook.borrowDate}</td>
              <td>{borrowedBook.dueDate}</td>
              <td>{borrowedBook.returnDate || "Not Returned Yet"}</td>
              <td>{renderBorrowStatus(borrowedBook.borrowStatus || 'Not-Applicable')}{borrowedBook.borrowStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination Controls for View History */}
    {currentHistoryRecords.length > 0 && (
      <div className={style.pagination}>
        <button
          disabled={currentPageHistory === 1}
          onClick={() => setCurrentPageHistory(currentPageHistory - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPageHistory} of {totalHistoryPages}
        </span>
        <button
          disabled={currentPageHistory === totalHistoryPages}
          onClick={() => setCurrentPageHistory(currentPageHistory + 1)}
        >
          Next
        </button>
      </div>
    )}

    <button onClick={() => setShowViewHistoryModal(false)}  className={style["close-button"]}>Close</button>
  </div>
)}
   {showPreBookingModal && (
        <div className={style.modal}>
        <form onSubmit={handlePreBooking}>
          <div>
          <label>
      Book ID:
      <select
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        required
      >
        <option value="">Select a Book</option>
        {availableBooks.length === 0 ? (
          <option>No available books</option>
        ) : (
          availableBooks.map(book => (
            <option key={book.bookID} value={book.bookID}>
              {book.title} {/* Display book title or any other attribute */}
            </option>
          ))
        )}
      </select>
    </label>
          </div>
          <button type="submit">Pre-book</button>
          <button onClick={()=>setShowPreBookingModal(false)} className={style["close-button"]}>Close</button>
        </form>
        </div>
      )}
       {showCancelPreBookingModal && (
    <div className={style.modal}>
      <h2>Cancel Pre-booking</h2>
      <label>
  Book ID:
  <select
    value={bookId}
    onChange={(e) => setBookId(e.target.value)}
  >
    <option value="">Select a book</option> {/* Default option */}
    {allBooks.map((book) => (
      <option key={book.bookID} value={book.bookID}> {/* Adjust the value according to your book ID field */}
        {book.title} {/* Display the title of the book */}
      </option>
    ))}
  </select>
</label>

      <button onClick={handleCancelPreBooking}>Confirm Cancellation</button>
      <button onClick={() => setShowCancelPreBookingModal(false)}>Close</button>
    </div>
  )}
  {showApproveBooking && (
        <div className={style.modal}>
          <h3>Approve Book</h3>
          <label>
      User Email:
      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)} // Update userId when a user is selected
      >
        {console.log("PreBooking books", allUsers)}
        <option value="">Select a user</option> {/* Default option */}
        {allUsers1.length > 0 ? (
          allUsers1.map((user) => (
            <option key={user.userID} value={user.userID}>
              {user.email} {/* Display the email as the option text */}
            </option>
          ))
        ) : (
          <option value="">No users found</option> // Option to indicate no users found
        )}
      </select>
    </label><label>
  Book ID:
  <select
    value={bookId}
    onChange={(e) => setBookId(e.target.value)}
  >
    <option value="">Select a book</option> {/* Default option */}
    {allBooks.map((book) => (
      <option key={book.bookID} value={book.bookID}> {/* Adjust the value according to your book ID field */}
        {book.title} {/* Display the title of the book */}
      </option>
    ))}
  </select>
</label>
<button onClick={handleApproveBook}>Borrow</button>
          <button onClick={() => setShowApproveBooking(false)}>Cancel</button>
</div>)}
    </div>
  );
};

export default BorrowedBooks; 