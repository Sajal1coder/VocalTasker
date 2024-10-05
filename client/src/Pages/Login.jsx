import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLogin } from '../redux/state'
import'../style/Login.css'
import Header from '../Components/Header'

const Login = () => {
   const [email,setEmail]=useState("")
   const [password,setPassword]=useState("")
   const [error, setError] = useState(null);

const dispatch=useDispatch()
const navigate=useNavigate()

    const handleSubmit=async(e)=>{
      e.preventDefault()
      try{
        const response= await fetch("http://localhost:8001/auth/login",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({email,password})
        })

        const loggedIn= await response.json()
        if(response.ok){
          setError(null);
          dispatch(
            setLogin({
              user:loggedIn.user,
              token:loggedIn.token
            })
          )
          navigate("/")
        }
        else{
          setError(loggedIn.message);
        }
      } catch(err){
        console.log("login failed",err.message);
        setError("An error occurred. Please try again.");
      }
    }
  return (
    <>
    <Header/>
    <div className='login'>
    <div className='login_form'>
         <form className='login_detail'onSubmit={handleSubmit}>
              <input
              placeholder='Email'
              name='email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required/>
              <input
              placeholder='Password'
              name='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required/>
              <button type='submit'>Log in</button>
         </form>
         <a href="/register">Don't have an account? Sign Up Here</a>
         {error && <p>{error}</p>}
    </div>
    </div>
    </>
  )
}

export default Login
