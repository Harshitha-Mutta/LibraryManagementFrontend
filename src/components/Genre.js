import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from "./../style/genre.module.css"; // Assuming you create a separate CSS file for styling

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState({ genreName: "" });
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const token = localStorage.getItem('token'); 
  // Array of 10 default images
  const defaultImages = [
    'https://static.vecteezy.com/system/resources/thumbnails/028/274/915/small/strong-athletic-male-fighter-view-from-the-back-photo.jpg', //Action
'https://wallpapers.com/images/hd/romance-pictures-9nus2ne9xefezvcs.jpg',//Romance
'https://img.freepik.com/free-photo/open-book-concept-fairy-tale-fiction-storytelling_23-2150793709.jpg',//Fiction
'https://images.saymedia-content.com/.image/t_share/MTg3OTczMDQ3MTcxNDI2MTk3/best-narrative-nonfiction-books-for-kids.jpg',  //kids
'https://i.pinimg.com/originals/d0/96/63/d096637c9971772c88e16811d5a999be.jpg',//history
'https://i.pinimg.com/736x/1e/4d/90/1e4d90d5f40f1bf9bb592742b309023e.jpg', //literture
'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1510665502i/36593457.UX160.jpg',  // Non-fiction
    'https://media.gq.com/photos/59efa5f866e2d56abcd7a055/4:3/w_1728,h_1296,c_limit/state-of-horror-gq.jpg',  // horror
    'https://images.buyagift.co.uk/content/HtmlTemplates/Contentful/MainContent/Category/Adventure/hero/small/hero-desktop-2x.jpg',  // adventure
    'https://img.freepik.com/free-photo/war-tank-dark-style_23-2151605523.jpg',  //war
    'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg',//fantasy
    'https://visme.co/blog/wp-content/uploads/2021/06/sophie-kinsella-the-undomestic-goddess-book-cover-example.jpeg',//romcom
    'https://upload.wikimedia.org/wikipedia/en/1/10/Can_You_Keep_a_Secret_book_cover.jpg',// Kids Fantacy
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOL8CzMPNvAvEDOAcZ5e2jH_3eecaNKYZb1g&s',// magical Realism
    'https://mir-s3-cdn-cf.behance.net/project_modules/hd/ebc2cb66025105.5b07eb2d6dcef.jpg',// detective
    'https://m.media-amazon.com/images/I/61hm4gCzPoL.UF1000,1000_QL80.jpg'//biography
  ];

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get("https://localhost:7023/api/Genre", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenres(response.data);
    } catch (err) {
      setError("Error fetching genres.");
      console.error(err);
    }
  };

  const handleAddGenre = async () => {
    try {
      await axios.post("https://localhost:7023/api/Genre", newGenre, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPopupOpen(false);
      setNewGenre({ genreName: "" });
      fetchGenres();
    } catch (err) {
      setError("Error adding genre.");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setNewGenre({ ...newGenre, genreName: e.target.value });
  };

  return (
    <div className={style["genre-container"]}>
      {error && <div className={style["error-message"]}>{error}</div>}

      {/* Add Genre Button at the top left */}
      <button className={style["add-genre"]} onClick={() => setIsPopupOpen(true)}>
        <span className={style["plus-sign"]}>+</span>
      </button>

      <div className={style["genre-grid"]}>
        {genres.map((genre, index) => (
          <div className={style["genre-card"]} key={genre.id}>
            <img
              src={defaultImages[index % defaultImages.length]} 
              alt={genre.genreName}
              className={style["genre-image"]}
            />
            <div className={style["genre-title"]}>{genre.genreName}</div>
          </div>
        ))}
      </div>

      {/* Popup for Adding Genre */}
      {isPopupOpen && (
        <div className={style["modal"]}>
          <div className={style["modal-content"]}>
            <span className={style["close"]} onClick={() => setIsPopupOpen(false)}>&times;</span>
            <h2>Add New Genre</h2>
            <input 
              type="text" 
              value={newGenre.genreName} 
              onChange={handleChange} 
              placeholder="Enter genre name" 
            />
            <button onClick={handleAddGenre}>Add Genre</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Genre;
