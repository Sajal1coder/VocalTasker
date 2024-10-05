import React from 'react'
import {Menu} from "@mui/icons-material"
import { useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { setLogout } from '../redux/state'
import { Link } from "react-router-dom";
import '../style/Header.css'

const Header = () => {
  const [dropdownmenu, setdrop] = useState(false);
  const dispatch=useDispatch();
  const user=useSelector((state)=>state.user);
const handleLogout=()=>{
  dispatch(setLogout());
};

  return (
    <>
    <div className='navbar'>
      <a  href="/">
      <img src='/assets/icon.png' alt='logo'/>
      </a>
    
    <div className='right-part'>
     {user?(
      <h1>
        Welcome {user.firstname}!
      </h1>
     ):(
      <a href='/login' className='head'>
        Login 
      </a>
     )}
     <button
     className='button_right' 
     onClick={()=>setdrop(!dropdownmenu)}>
      <Menu/>
     </button>
     {dropdownmenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/register">Sign Up</Link>
          </div>
        )}
      {dropdownmenu && user &&(
        <div className="navbar_right_accountmenu">
           <Link className='head' to={`/${user._id}/account`}>My Account</Link>
           <Link className='head' to="/" onClick={handleLogout}>Logout</Link>
        </div>
      )}
     
    </div>
    </div>
    </>
  )
}

export default Header

