import React, { createContext, useEffect, useState } from 'react';
import {LoadingScreen} from "../components/export"
const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  function checkLogin(){
    const request = new Request("/backend/checkLogin.php", 
      {
      method:"post",
      credentials: 'include'
    })
    
    fetch(request)
    .then(response=>{
          if(response.ok){
            return(response.text())
          }
    })
    .then(data=>{
          setIsLoggedIn(data == true)
          setIsCheckingLogin(false)
    })
    .catch(err=>{

    })
 }
   
useEffect(()=>{
  checkLogin()
}, [])


  if (isCheckingLogin) {
    return <LoadingScreen state={isCheckingLogin} />;
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };