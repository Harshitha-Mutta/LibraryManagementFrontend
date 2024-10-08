import React, { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("token");
  let role = "";

  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role;
  }
const RazorpayComponent = ({ orderID, amount, userId, setOrderID, setSuccessMessage }) => {
    console.log(orderID, "Hello", amount)
  useEffect(() => {
    const loadRazorpay = () => {
      const options = {
        key: "rzp_test_WyjSlk9HXWyxhD", // Enter the Key ID generated from the Dashboard
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Serenity Library",
        description: "Pay via website using RazorPay",
        order_id: orderID,
        image: "https://example.com/your_logo",
        prefill: {
          name: "Serenity Library",
          email: "kani2002shkka@gmail.com",
          contact: "6382415290",
        },
        notes: {
          address: "21, Book Street, CrossCut Nagar,Chennai,TamilNadu"
        },
        theme: {
          color: "#3399cc",
          image_padding: false,
        },
        handler: function (response) {
            console.log(response.razorpay_payment_id,userId, amount, "Samy")

          // Send payment details to your server
          // const formData = new FormData();
          // formData.append('razorpay_payment_id', response.razorpay_payment_id);
          // formData.append('userId', userId);
          // console.log(formData,"heee")
          const paymentId = response.razorpay_payment_id; // Ensure this is defined correctly
const Id = userId;
// Construct the URL
const url = `https://localhost:7023/api/Fine/PaymentResponse/${Id}`;

// Send the fetch request
fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Specify the content type
  },
  body: JSON.stringify(paymentId), // Send paymentId as a JSON string
}).then((res) => {
            console.log(res.data,res,"kanish")
            
            // Handle the response from your server
            if (res.ok) {
              // Payment successful
              console.log("Payment successful");
              setOrderID(null)
              setSuccessMessage("Payment successful")
    //window.location.reload();

            } else {
              // Payment failed
              console.log("Payment failed");
              setOrderID(null)
              setSuccessMessage("Payment Failed")
    //window.location.reload();

            }
          });
        },
        modal: {
          ondismiss: function () {
          },
          escape: true,
          backdropclose: false,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    // Load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = loadRazorpay;
    document.body.appendChild(script);
    

    return () => {
    {(orderID) &&

      document.body.removeChild(script);
     } // Clean up script on component unmount
    };
  }, [orderID, amount]);

  return (
    <>
    {orderID &&  
    <div id="razorpay-container">Loading Razorpay...</div>
}
</>
  );
};

export default RazorpayComponent;