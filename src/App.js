import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/signIn";
import Dashboard from "./components/Dashboard";
import BookManagement from './components/BookManagement';
import Profile from "./components/profile";
import BorrowedBooks from "./components/BorrowedBooks";
import Event from "./components/event";
import Genre from "./components/Genre";
import Reservations from "./components/Reservations";
import Members from "./components/Members";
import HomeContent from "./components/homeContent";
import Service from "./components/service";
import NavBar from "./components/NavBar";
import Rules from "./components/Rules";
import Timings from "./components/Timings";
import Contact from "./components/Contact";
// import NotFound from './pages/notFound';

function Layout() {
  const location = useLocation();
  
  // Define the paths where the NavBar should be displayed
  const showNavBarPaths = ["/", "/home", "/services", "/Rules", "/Timings", "/signIn", "/contact"];
  
  // Check if the current path matches any of the paths in showNavBarPaths
  const shouldShowNavBar = showNavBarPaths.includes(location.pathname);
  
  return (
    <div>
      {/* Conditionally render the NavBar */}
      {shouldShowNavBar && <NavBar />}
      
      <Routes>
        {/* Define all your routes here */}
        <Route path="/" element={<HomeContent />} />
        <Route path="/home" element={<HomeContent />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/services" element={<Service />} />
        <Route path="/Rules" element={<Rules />} />
        <Route path="/Timings" element={<Timings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<BookManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/borrowedbook" element={<BorrowedBooks />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/reservation" element={<Reservations />} />
        <Route path="/event" element={<Event />} />
        <Route path="/members" element={<Members />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;