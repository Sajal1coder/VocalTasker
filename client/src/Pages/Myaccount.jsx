// MyAccount.js
import React, { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux'
import { useParams } from 'react-router-dom';
import { setLogout } from '../redux/state'
import '../style/account.css'

const MyAccount = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message,setMessage]=useState('');
  const dispatch=useDispatch();

  useEffect(() => {
    fetch(`http://localhost:8001/api/users/${userId}/account`)
      .then(response => response.json())
      .then(data => setUser(data.user));
  }, [userId]);

  const handleDeleteAccount = async (e) => {
    dispatch(setLogout());
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8001/api/users/${userId}/account`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log(data);
      alert('Account deleted Succesfully');
      window.location.href = '/login';
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const updatedPassword = {
      oldPassword,
      newPassword,
    };
    try {
      const response = await fetch(`http://localhost:8001/api/users/${userId}/account/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPassword),
      });
      const data = await response.json();
      console.log(data);
      setMessage(data.message);
    } catch (err) {
      console.log(err);
      setMessage(err);
    }
  };

  return (
    <div className='container'>
      <h2>Account Information</h2>
      <div className="account-info">
      <p>
        <strong>User ID:</strong> {userId}
      </p>
      <p>
        <strong>Name:</strong> {user.firstname} {user.lastname}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Password:</strong> *********
      </p>
      </div>
      <h2>Account Actions</h2>
      <div className="account-actions">
      
      <form onSubmit={handleChangePassword}>
        <label>Old Password:</label>
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <br />
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <br />
        <button type="submit">Change Password</button>
        {message && <p style={{color:"red"}}>{message}</p>}
      </form>

      <form onSubmit={handleDeleteAccount}>
        <button style={{background:"#880808"}} type="submit">Delete Account</button>
      </form>
      </div>
    </div>
  );
};

export default MyAccount;