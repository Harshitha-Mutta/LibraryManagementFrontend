import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './../style/book.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

const BookManagement = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        genreID: 0,
        publisherName: '',
        publicationDate: '',
        language: '',
        description: '',
        totalCopies: 0
    });
    const [books, setBooks] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({
        title: '',
        author: '',
        genreName: '',
        publisherName: '',
        language: ''
    });
    const [error, setError] = useState('');
    const [editingBookId, setEditingBookId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Adjust this value as needed

    const token = localStorage.getItem('token');
    let role = '';
    if (token) {
        const decodedToken = jwtDecode(token);
        role = decodedToken.role;
    }

    useEffect(() => {
        fetchBooks();
        fetchGenres();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('https://localhost:7023/api/Book/search', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBooks(response.data);
        } catch (err) {
            setError('Error fetching books.');
            console.error(err);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await axios.get('https://localhost:7023/api/Genre', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setGenres(response.data);
        } catch (err) {
            setError('Error fetching genres.');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({ ...searchCriteria, [name]: value });
        setCurrentPage(1); // Reset to the first page on search
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingBookId) {
                await axios.put(`https://localhost:7023/api/Book/${editingBookId}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Book updated successfully!');
                setEditingBookId(null);
            } else {
                await axios.post('https://localhost:7023/api/Book', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Book added successfully!');
            }
            resetForm();
            fetchBooks();
            setIsModalOpen(false);
        } catch (err) {
            setError('Error adding/updating book.');
            console.error(formData);
        }
    };

    const handleEdit = (book) => {
        setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            genreID: Number(book.genreID),
            publisherName: book.publisherName,
            publicationDate: book.publicationDate,
            language: book.language,
            description: book.description,
            totalCopies: Number(book.totalCopies)
        });
        setEditingBookId(book.bookID);
        setIsModalOpen(true);
    };

    const handleDelete = async (bookID) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this book?");

        if (isConfirmed) {
            try {
                await axios.delete(`https://localhost:7023/api/Book/${bookID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Book deleted successfully!');
                fetchBooks();
            } catch (err) {
                setError('Error deleting book.');
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            isbn: '',
            genreID: '',
            publisherName: '',
            publicationDate: '',
            language: '',
            description: '',
            totalCopies: ''
        });
    };

    // Filtering books based on search input
    const filteredBooks = books.filter((book) => {
        const matchesTitle = (book.title || "").toLowerCase().includes(searchCriteria.title.toLowerCase());
        const matchesAuthor = (book.author || "").toLowerCase().includes(searchCriteria.author.toLowerCase());
    
        // Find the genreID based on the entered genreName
        const matchingGenre = genres.find((genre) => genre.genreName.toLowerCase() === searchCriteria.genreName.toLowerCase());
        const matchesGenre = searchCriteria.genreName === "" || (matchingGenre && book.genreID === matchingGenre.genreID);
    
        const matchesPublisher = (book.publisherName || "").toLowerCase().includes(searchCriteria.publisherName.toLowerCase());
        const matchesLanguage = (book.language || "").toLowerCase().includes(searchCriteria.language.toLowerCase());
    
        return matchesTitle && matchesAuthor && matchesGenre && matchesPublisher && matchesLanguage;
    });

    // Pagination logic
    const indexOfLastBook = currentPage * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

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
        <div>
            {role === 'Admin' && (
                <button className={style["add-book-button"]} onClick={() => setIsModalOpen(true)}> + Add Book</button>
            )}

            <h2>Search Books</h2>
            <form className={style["search-form"]}>
                <input
                    type="text"
                    name="title"
                    placeholder="Search by Title"
                    value={searchCriteria.title}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Search by Author"
                    value={searchCriteria.author}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    name="genreName"
                    placeholder="Search by Genre"
                    value={searchCriteria.genreName}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    name="publisherName"
                    placeholder="Search by Publisher"
                    value={searchCriteria.publisherName}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    name="language"
                    placeholder="Search by Language"
                    value={searchCriteria.language}
                    onChange={handleSearchChange}
                />
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h2>Books List</h2>
            <table className={style["books-table"]}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Language</th>
                        <th>Description</th>
                        <th>Status</th>
                        {role === 'Admin' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentBooks.map((book) => (
                        <tr key={book.bookID}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.language}</td>
                            <td>{book.description}</td>
                            <td>
                                {book.availableCopies > 0 ? (
                                    <span>
                                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', marginRight: '5px' }} />
                                        Available
                                    </span>
                                ) : (
                                    <span>
                                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red', marginRight: '5px' }} />
                                        Not Available
                                    </span>
                                )}
                            </td>
                            {role === 'Admin' && (
                                <td>
                                    <button className={style["edit-button"]} onClick={() => handleEdit(book)}>Edit</button>
                                    <button className={style["delete-button"]} onClick={() => handleDelete(book.bookID)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className={style.paginationButtons}>
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

            {/* Modal for adding/editing a book */}
            {isModalOpen && (
                <div className={style["modal"]}>
                    <div className={style["modal-content"]}>
                        <span className={style["close"]} onClick={() => setIsModalOpen(false)}>
                            &times;
                        </span>
                        <h3>{editingBookId ? 'Edit Book' : 'Add Book'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="author"
                                placeholder="Author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="isbn"
                                placeholder="ISBN"
                                value={formData.isbn}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="genreID"
                                value={formData.genreID}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Genre</option>
                                {genres.map((genre) => (
                                    <option key={genre.genreID} value={genre.genreID}>
                                        {genre.genreName}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="publisherName"
                                placeholder="Publisher"
                                value={formData.publisherName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="date"
                                name="publicationDate"
                                value={formData.publicationDate}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="language"
                                placeholder="Language"
                                value={formData.language}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="totalCopies"
                                placeholder="Total Copies"
                                value={formData.totalCopies}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className={style["submit-button"]}>
                                {editingBookId ? 'Update Book' : 'Add Book'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookManagement;
