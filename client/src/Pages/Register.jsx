import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Register.css';
import Header from '../Components/Header';

const Register = () => {
  const [formdata, setformdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [passwordMatch, setpasswordMatch] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if passwords match
    setpasswordMatch(formdata.password === formdata.confirmPassword || formdata.confirmPassword === "");
  }, [formdata.password, formdata.confirmPassword]); // Add dependencies for useEffect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const regis_form = new FormData(); // Use capital 'F' for FormData

      // Append form data
      for (const key in formdata) {
        regis_form.append(key, formdata[key]);
      }

      // Send registration request
      const response = await fetch("http://localhost:8001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Set content type to JSON
        },
        body: JSON.stringify(formdata)
      });

      if (response.ok) {
        navigate('/login'); // Redirect on successful registration
        setError(null);
      } else {
        console.error('Registration failed:', await response.text());
        setError('Registration failed',response.text());
      }
    } catch (err) {
      console.log("Registration failed:", err.message);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
     <Header/>
    <div className='register'>
     
      <div className='register_content'>
        <form className='register_content_form' onSubmit={handleSubmit}>
          <input
            placeholder='First Name'
            name="firstname"
            value={formdata.firstname}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Last Name'
            name="lastname"
            value={formdata.lastname}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Email'
            name="email"
            value={formdata.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Password'
            name='password'
            type='password' // Mask password input
            value={formdata.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Confirm Password'
            name='confirmPassword'
            type='password' // Mask password input
            value={formdata.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match!</p>
          )}
          <button type="submit" disabled={!passwordMatch}>REGISTER</button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>

        {error && <p style={{color:"red"}}>{error}</p>}
      </div>
    </div>
    </>
  );
}

export default Register;
