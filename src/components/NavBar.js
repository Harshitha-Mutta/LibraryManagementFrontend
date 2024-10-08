// import React, { useState } from "react";
// import style from "./../style/header.module.css";
// import logo from "./../assets/logo.jpg";
// import { useNavigate } from "react-router-dom";
// // import HomeIcon from '@mui/icons-material/Home';

// const Header = () => {
//   const navigate = useNavigate();
//   const [login, setLogin] = useState(false);
//   const handlelogin = async () => {
//     await setLogin(true);
//     if (login) {
//       navigate("/signIn");
//     }
//   };
//   return (
//     <div className={style["header-container"]}>
//       <div className={style["logo-container"]}>
//         {<img src={logo} alt="logo" /> }

//       </div>
//       <div className={style["right-header"]}>
//         <div className={style["tab-container"]}>
//           <div onClick={() => navigate("/home")} className={style.tab}>
//             Home
//           </div>
//           <div onClick={()=>navigate("service")} className={style.tab}>Service</div>
//           <div onClick={()=>navigate("timings")} className={style.tab}>Timing</div>
//           <div onClick={()=>navigate("rules")} className={style.tab}>Rules</div>
//           <div onClick={()=>navigate("contact")} className={style.tab}>Contact us</div>
//         </div>
//         <div
//           style={{ background: "#47b347" }}
//           className={style.tab}
//           onClick={() => handlelogin()}
//         >
//           Login
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Header;
import {Link} from 'react-router-dom';
import style from './../style/navbar.module.css';
export default function NavBar()
{
    return (
        <div className={style["nav-container"]}>
        
        <ul>
                <li><Link to='/home'>Home</Link></li>
                <li><Link to='/services'>Services</Link></li>
                <li><Link to='/Rules'>Rules</Link></li>
                <li><Link to='/Timings'>Timings</Link></li>
                <li><Link to='/contact'>Contact</Link></li>
                <li><Link to='/signIn'>Login</Link></li>
                
        </ul>
        </div>
    );
}