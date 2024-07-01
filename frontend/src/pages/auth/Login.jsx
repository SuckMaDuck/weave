import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import {LoadingScreen, Bg} from '../../components/export';

const Login = () => {

  const {isLoggedIn ,setIsLoggedIn } = useContext(LoginContext);
  const nav = useNavigate();
  const [err, setErr] = useState({});
  const [loadState, setLoadState] = useState(false);
  useEffect(()=>{
    if(isLoggedIn == true){
      nav("/");
    }
},[])


  function login(e){
    setLoadState(true);
    e.preventDefault();
    const request = new Request("/backend/login.php",{
      method: "POST",
      body: new FormData(e.target)

    })
    fetch(request)
    .then((response)=>{
      if(response.ok){
        setLoadState(false);
        return(response.json())
      
      }
    })
    .then((data)=>{
      if(data.status){
        setIsLoggedIn(true)
        nav("/")
      }
      else{
        setErr(data);
      }
    })
    .catch((error)=>{
      setLoadState(false);
      setErr({general: "An error occurred. Please try again."})
    })

}

if(isLoggedIn){
  return(<Bg />);
}
  return (
    <>
      <LoadingScreen state={loadState} />
       <Bg />

      <form action="" id='loginForm' onSubmit={login}>
      <div className='logo-container'>
        <figure className='logo'></figure>
        <h1>Weave</h1>
      </div>
        <div className='form-block' style={{width:'530px'}}>
          <div className='input-field'>
                    <label style={{fontSize: '1.1rem'}}>Email <span>{err.message && err.message["email"] ? err.message.email: ""}</span></label>
                    <input type="email" name='email' className={err.message && err.message["email"] ?  "err":""} />
          </div>  
          <div className='input-field'> 
                <label style={{fontSize: '1.1rem'}}>Password <span>{err.message && err.message["password"] ?  err.message.password: ""}</span></label>
                <input type="password" name='password' className={err.message && err.message["password"] ?  "err" :""} />
          </div>

          <div className='form-btnZ-container'>
                <div className='btnz' style={{ display:'flex',  justifyContent:'center', alignItems:'center'}}>
                   <input type='submit'  value="Login" className='form-btn' form='loginForm' style={{padding:"0.4em", width:'100%'}} />
                </div>
          </div>
        </div>
        <div className='form-links'>
          <Link to="/register">Create an account</Link>
          <Link to="/ResetPassword">Forgot password?</Link>
        </div>
     
      </form>
     
    </>
  )
  
}
export default Login