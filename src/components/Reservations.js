import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import style from "./../style/reserve.module.css";
import { jwtDecode } from 'jwt-decode';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [status, setStatus] = useState('All'); // Default status is 'All'
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [bookID, setBookID] = useState(''); // State for BookID
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelBookName, setCancelBookName] = useState(''); // State for book name during cancellation
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userId'); // Assuming you have userID in localStorage
    const [isAdmin, setIsAdmin] = useState(false); // State to check if user is an admin
    const [unavailableBooks, setUnavailableBooks] = useState([]);
    const [activeReservations, setActiveReservations] = useState([]);

    let role = '';
    if (token) {
        const decodedToken = jwtDecode(token);
        role = decodedToken.role;
    }

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [totalReservations, setTotalReservations] = useState(0);

    useEffect(() => {
         // Check if the user role is Admin
         if (role === 'Admin') {
            setIsAdmin(true); // If admin, set isAdmin to true
        }
        console.log(role);
        fetchReservations();
        fetchUnavailableBooks();
        fetchActiveReservations();
    }, [status]);

    const fetchReservations = async () => {
        try {
            let response;
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            if (status === 'All') {
                // If status is 'All', fetch all reservations based on role
                response = await axios.get(role==='Admin' ? 
                    'https://localhost:7023/api/Reservation' :  // Admin sees all reservations
                    `https://localhost:7023/api/Reservation/user/${userID}`, config); // User sees only their reservations
                    {console.log(response.data,isAdmin);}
            } else {
                // Fetch reservations by status and userID based on role
                response = await axios.get(role==='Admin' ? 
                    `https://localhost:7023/api/Reservation/status/${status}` :  // Admin filter by status
                    `https://localhost:7023/api/Reservation/status/${status}/user/${userID}`, config); // User filter by status and their own ID
            }

            setErrorMessage('');
            setReservations(response.data);
            setTotalReservations(response.data.length);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('No reservations found');
            } else {
                setErrorMessage('An error occurred while fetching reservations');
            }
            setReservations([]);
        }
    };
    const fetchUnavailableBooks = async () => {
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` } // Ensure you have the token for authentication
            };
            const response = await axios.get('https://localhost:7023/api/Book/notavailable', config); // Use the correct endpoint
            setUnavailableBooks(response.data); // Update state with the retrieved books
        } catch (error) {
            console.error('Error fetching unavailable books:', error);
        }
    };
    const fetchActiveReservations = async () => {
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const response = await axios.get(`https://localhost:7023/api/Reservation/active/${userID}`, config);
            setActiveReservations(response.data); // Set the active reservations state
        } catch (error) {
            console.error('Error fetching active reservations:', error);
        }
    };
    
    const handleStatusChange = async (event) => {
        const selectedStatus = event.target.value;
        setStatus(selectedStatus);
        setCurrentPage(1); // Reset to first page when status changes
    };

    const handleAddReservation = async (event) => {
        event.preventDefault(); // Prevent the default form submission
        try {
            const reservationDto = {
                UserID: userID,
                BookName: bookID,
            };
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            await axios.post('https://localhost:7023/api/Reservation', reservationDto, config);
            alert('Reservation created successfully!');
            setIsModalOpen(false); // Close the modal after submission
            // Optionally reset the form fields
            setBookID('');
            fetchReservations(); // Fetch reservations to refresh the list
        } catch (error) {
            console.error('Error adding reservation:', error);
            alert('Failed to add reservation');
        }
    };

    const handleCancelReservation = async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
    
            // Send POST request with BookName and UserID as query parameters in the URL
            await axios.post(`https://localhost:7023/api/Reservation/cancel?BookName=${cancelBookName}&UserID=${userID}`, null, config);
    
            alert('Reservation cancelled successfully!');
            setIsCancelModalOpen(false); // Close modal after successful cancellation
            fetchReservations(); // Refresh the reservation list
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            if (error.response && error.response.status === 400) {
                alert('Failed to cancel reservation. Please check the details.');
            } else {
                alert('An error occurred while cancelling the reservation.');
            }
        }
    };

    const renderStatusIcon = (reservationStatus) => {
        switch (reservationStatus) {
            case 'Completed':
                return <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />;
            case 'Approved':
                return <FontAwesomeIcon icon={faClipboardCheck} style={{ color: 'blue' }} />;
            case 'Cancelled':
                return <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />;
            case 'Active':
                return <FontAwesomeIcon icon={faClock} style={{ color: 'orange' }} />;
            default:
                return null;
        }
    };

    // Calculate current reservations for the current page
    const indexOfLastReservation = currentPage * itemsPerPage;
    const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
    const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalReservations / itemsPerPage);
    
    return (
        <div className="container">
            <h2>Reservations</h2>
            {role!=='Admin' && (<div>
            <button className={style["add-button"]} onClick={() => setIsModalOpen(true)}>Add Reservation</button>
            <button className={style["cancel-button"]} onClick={() => setIsCancelModalOpen(true)}>Cancel Reservation</button>
            </div>)}
            {isModalOpen && (
                <div className={style["modal"]}>
                    <div className={style["modal-content"]}>
                        <span className={style["close"]} onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Add Reservation</h2>
<form onSubmit={handleAddReservation}>
    <div>
        <label htmlFor="bookID">Book Name:</label>
        <select 
            name="bookID" 
            value={bookID} 
            onChange={(e) => setBookID(e.target.value)} 
            required
        >
            <option value="">Select a Book</option> {/* Default option */}
            {unavailableBooks.length === 0 ? (
                <option>No unavailable books found.</option>
            ) : (
                unavailableBooks.map(book => (
                    <option key={book.id} value={book.title}> {/* Set the value to book title */}
                        {book.title}
                    </option>
                ))
            )}
        </select>
    </div>
    <button type="submit">Create Reservation</button>
</form>

                    </div>
                </div>
            )}
            {isCancelModalOpen && (
                <div className={style["modal"]}>
                    <div className={style["modal-content"]}>
                        <span className={style["close"]} onClick={() => setIsCancelModalOpen(false)}>&times;</span>
                        <h2>Cancel Reservation</h2>
<form onSubmit={handleCancelReservation}>
    <div>
        <label htmlFor="cancelBookName">Book Name:</label>
        <select 
            name="cancelBookName" 
            value={cancelBookName} 
            onChange={(e) => setCancelBookName(e.target.value)} 
            required
        >
            <option value="">Select a Book</option>
            {activeReservations.length === 0 ? (
                <option>No active reservations found.</option>
            ) : (
                activeReservations.map(reservation => (
                    <option key={reservation.reservationID} value={reservation.bookTitle}>
                        {reservation.bookTitle} {/* Display book title */}
                    </option>
                ))
            )}
        </select>
    </div>
    <button type="submit">Cancel Reservation</button>
</form>

                    </div>
                </div>
            )}
            <label htmlFor="status">Filter by Status: </label>
            <select id="status" value={status} onChange={handleStatusChange}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
            </select>
            
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Book Title</th>
                        <th>Reservation Date</th>
                        <th>Status</th>
                        <th>Queue Position</th>
                    </tr>
                </thead>
                <tbody>
                    {currentReservations.length > 0 ? (
                        currentReservations.map((reservation) => (
                            <tr key={reservation.reservationID}>
                                <td>{reservation.userName}</td>
                                <td>{reservation.bookTitle}</td>
                                <td>{new Date(reservation.reservationDate).toLocaleDateString()}</td>
                                <td>
                                    {renderStatusIcon(reservation.reservationStatus)} {reservation.reservationStatus}
                                </td>
                                <td>{reservation.queuePosition}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No reservations found</td> {/* Adjusted colspan to match table structure */}
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className={style["pagination"]}>
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Reservations;
