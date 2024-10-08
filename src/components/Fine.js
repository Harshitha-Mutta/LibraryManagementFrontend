import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import style from "./../style/fine.module.css";
import { jwtDecode } from 'jwt-decode';
import RazorpayComponent from './RazorPay';

function Fine() {
  const [fines, setFines] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const finesPerPage = 5; // Set the number of fines to display per page
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0);
  const token = localStorage.getItem('token');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); // State for the selected status
  const [orderID, setOrderID] = useState(null);
  const [amount, setAmount] = useState(0);
  let role = '';
  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role;
  }

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchFines = async () => {
      try {
        let response;
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        if (selectedStatus === 'All') {
          // If status is 'All', fetch all fines based on role
          response = await axios.get(role === 'Admin' ? 
            'https://localhost:7023/api/Fine' : // Admin sees all fines 
            `https://localhost:7023/api/Fine/user/${userId}`, config); // User sees only their fines 
        } else {
          // Fetch fines by status and userID based on role
          response = await axios.get(role === 'Admin' ? 
            `https://localhost:7023/api/Fine/status/${selectedStatus}` : // Admin filter by status 
            `https://localhost:7023/api/Fine/user/${userId}/status/${selectedStatus}`, config); // User filter by status and their own ID 
        }
        
        console.log(response.data, role); // Log the response data and user role
        setFines(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("No fines found for the selected criteria.");
        } else {
          console.error("Error fetching fines:", error);
          setError("Error fetching fines.");
        }
      }
    };

    const fetchTotalUnpaid = async () => {
      try {
        if (role !== 'Admin') {
          // Fetch total unpaid fines for the specific user if not admin
          const response = await axios.get(`https://localhost:7023/api/Fine/total-unpaid/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setTotalUnpaidAmount(response.data.totalUnpaidAmount);
        } else {
          const response = await axios.get('https://localhost:7023/api/Fine/total-unpaid', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setTotalUnpaidAmount(response.data.totalUnpaidAmount);
        }
      } catch (error) {
        console.error("Error fetching total unpaid amount:", error);
      }
    };

    fetchFines();
    fetchTotalUnpaid();
  }, [token, selectedStatus]); // Add selectedStatus as a dependency
  const parseResponse = (responseString) => {
    console.log(responseString, "paaaaa")
    const [id, amt] = responseString.split(',');
    console.log(id,amt,"eeeeeeeeee") // Split by comma
    setOrderID(id); // Set orderId as string
    setAmount(parseFloat(amt)); // Set amount as decimal
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(`https://localhost:7023/api/Fine/pay-total/${userId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 200) {
        setTotalUnpaidAmount(0); // Reset the total unpaid amount
        setFines([]); // Clear the fines after payment
        if(response.data === "Error"){
          setSuccessMessage(`No payment for this user`);

        }
        else{
          parseResponse(response.data)
          console.log(response)
        }
        
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Error processing payment");
    }
  };
  // useEffect(() => {
  // console.log(orderID);
  //   <RazorpayComponent orderID={orderID} amount="500"/>
  //   },[orderID])

  const indexOfLastFine = currentPage * finesPerPage;
  const indexOfFirstFine = indexOfLastFine - finesPerPage;
  const currentFines = fines.slice(indexOfFirstFine, indexOfLastFine);
  const totalPages = Math.ceil(fines.length / finesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(1); // Reset to first page when changing status
  };
  

  return (
    <>
      {orderID !== null ?
    <RazorpayComponent orderID={orderID} amount={amount} userId={userId} setOrderID={setOrderID} setSuccessMessage={setSuccessMessage}/>
    :
    <div className={style["fine-table-container"]}>
    
      <h2>Fine Management</h2>
      <h4>Total Unpaid Amount: ${totalUnpaidAmount.toFixed(2)}</h4>

      {/* Dropdown for selecting fine status */}
      <select value={selectedStatus} onChange={handleStatusChange}>
        <option value="All">All</option>
        <option value="Paid">Paid</option>
        <option value="NotPaid">NotPaid</option>
      </select>

      {role !== 'Admin' && totalUnpaidAmount > 0 && (
        <button className={style["pay-button"]} onClick={handlePayment}>
          Pay Total Amount of ${totalUnpaidAmount.toFixed(2)}
        </button>
      )}

      {successMessage && <div className={style["success-message"]}>{successMessage}</div>}
      {error && <div className={style["error-message"]}>{error}</div>} {/* Display error message here */}

      <table className={style["fine-table"]}>
        <thead>
          <tr>
            <th>Fine ID</th>
            <th>User Name</th>
            <th>Book Title</th>
            <th>Amount</th>
            <th>Fine Date</th>
            <th>Paid Status</th>
          </tr>
        </thead>
        <tbody>
          {currentFines.map((fine) => (
            <tr key={fine.fineID}>
              <td>{fine.fineID}</td>
              <td>{fine.userName}</td>
              <td>{fine.bookTitle}</td>
              <td>{fine.amount}</td>
              <td>{new Date(fine.fineDate).toLocaleDateString()}</td>
              <td>
                {fine.paidStatus === 'Paid' ? (
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', marginRight: '5px' }} />
                    Paid
                  </span>
                ) : (
                  <span>
                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red', marginRight: '5px' }} />
                    NotPaid
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style["pagination"]}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={pageNumber === currentPage ? 'active' : ''}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>}
    </>
  );
}

export default Fine;
