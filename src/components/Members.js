import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import style from "./../style/Members.module.css"; // Adjust the path as needed

const Members = ({ role, token }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [totalUser, setTotalUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Number of users per page (adjust as needed)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await axios.get("https://localhost:7023/api/User", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUser(users.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1); // Reset to first page on role change
  };

  const filteredUsers = totalUser.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchInput.toLowerCase());
    const matchesRole =
      selectedRole === "All" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleInfoClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={style["members-container"]}>
      <>
        <h2>
          <FontAwesomeIcon icon={faUsers} /> Users
        </h2>
        <div className={style["filter-container"]}>
          <input
            className={style["search-input"]}
            value={searchInput}
            onChange={handleSearch}
            type="text"
            placeholder="Search by email"
          />
          <select
            className={style["dropdown"]}
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="All">All</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Table displaying Name, Email, BookCount, and Info icon */}
        <table className={style["user-table"]}>
          <thead>
            <tr>
              <th>Name</th>
              <th className={style["email-column"]}>Email</th>
              <th>Book Count</th>
              <th className={style["info-column"]}>Info</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.bookCount}</td>
                <td className={style["info-icon-cell"]}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className={style["info-icon"]}
                    onClick={() => handleInfoClick(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className={style["pagination"]}>
          <button
            className={style["pagination-button"]}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={style["pagination-button"]}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Modal for detailed information */}
        {isModalOpen && selectedUser && (
          <div className={style["modal"]}>
            <div className={style["modal-content"]}>
              <span className={style["close"]} onClick={closeModal}>
                &times;
              </span>
              <h3>User Information</h3>
              <div>
                Name: <span>{selectedUser.name}</span>
              </div>
              <div>
                Email: <span>{selectedUser.email}</span>
              </div>
              <div>
                Phone Number: <span>{selectedUser.phoneNumber}</span>
              </div>
              <div>
                Address: <span>{selectedUser.address}</span>
              </div>
              <div>
                Registration Date:{" "}
                <span>{selectedUser.registrationDate}</span>
              </div>
              <div>
                Books Count: <span>{selectedUser.bookCount}</span>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Members;
