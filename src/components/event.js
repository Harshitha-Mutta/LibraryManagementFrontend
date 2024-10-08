import React, { useEffect, useState } from "react";
import style from "./../style/event.module.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import the icons

const Event = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState();
  const [editIndex, setEditIndex] = useState(null);
  const [editableEvent, setEditableEvent] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    eventDate: "",
    description: "",
    timing: "",
  });
  const token = localStorage.getItem("token");
  let role = "";

  if (token) {
    const decodedToken = jwtDecode(token);
    role = decodedToken.role;
  }

  useEffect(() => {
    handleEvents();
  }, []);

  const handleEvents = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7023/api/Event/upcoming",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(response.data);
    } catch (err) {
      setError("Error fetching events.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7023/api/Event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleEvents();
    } catch (err) {
      setError("Error deleting event.");
      console.error(err);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditableEvent(events[index]);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`https://localhost:7023/api/Event/${id}`, editableEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditIndex(null);
      handleEvents();
    } catch (err) {
      setError("Error saving event.");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditableEvent({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      await axios.post("https://localhost:7023/api/Event", newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPopupOpen(false);
      setNewEvent({
        eventName: "",
        eventDate: "",
        description: "",
        timing: "",
      });
      handleEvents();
    } catch (err) {
      setError("Error adding event.");
      console.error(err);
    }
  };

  return (
    <div className={style["event-container"]}>
      <h1 className="event-heading">Upcoming Events</h1>
      {role === "Admin" && (
        <div className={style["add-container"]}>
          <div className={style.add} onClick={() => setIsPopupOpen(true)}>
            + &nbsp; Add
          </div>
        </div>
      )}
      <div className={style["event-content"]}>
        {events?.map((data, index) => (
          <div key={index} className={style["event-detail"]}>
            {editIndex === index ? (
              <>
                <div>
                  <input
                    placeholder="Event name"
                    type="text"
                    name="eventName"
                    value={editableEvent.eventName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    type="date"
                    placeholder="Event date"
                    name="eventDate"
                    value={editableEvent.eventDate.split("T")[0]}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Event description"
                    name="description"
                    value={editableEvent.description}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    placeholder="Event timing"
                    type="text"
                    name="timing"
                    value={editableEvent.timing}
                    onChange={handleChange}
                  />
                </div>

                <div
                  className={style["add"]}
                  onClick={() => handleSave(editableEvent.eventID)}
                >
                  Save
                </div>
                <div className={style["add"]} onClick={handleCancel}>
                  Cancel
                </div>
              </>
            ) : (
              <>
                <div>
                  Event name: <span>{data.eventName}</span>
                </div>
                <div>
                  Date: <span>{data.eventDate}</span>
                </div>
                <div>
                  Description: <span>{data.description}</span>
                </div>
                <div>
                  Timing: <span>{data.timing}</span>
                </div>
                {role === "Admin" && (
                  <>
                    <div
                      className={style["add"]}
                      onClick={() => handleDelete(data.eventID)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete
                    </div>
                    <div
                      className={style["add"]}
                      onClick={() => handleEdit(index)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> &nbsp; Edit
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className={style.popup}>
          <div className={style.popupContent}>
            <h2>Add New Event</h2>
            <div>
              <input
                style={{ width: "300px", height: "35px" }}
                placeholder="Event Name"
                type="text"
                name="eventName"
                value={newEvent.eventName}
                onChange={handleNewEventChange}
              />
            </div>
            <div>
              <input
                style={{ width: "100%", height: "35px" }}
                type="date"
                placeholder="Event Date"
                name="eventDate"
                value={newEvent.eventDate}
                onChange={handleNewEventChange}
              />
            </div>
            <div>
              <textarea
                style={{ width: "100%" }}
                placeholder="Description"
                name="description"
                value={newEvent.description}
                onChange={handleNewEventChange}
              />
            </div>
            <div>
              <input
                style={{ width: "100%", height: "35px" }}
                placeholder="Timing"
                type="text"
                name="timing"
                value={newEvent.timing}
                onChange={handleNewEventChange}
              />
            </div>
            <div className={style["add"]} onClick={handleAddEvent}>
              Add Event
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

export default Event;
