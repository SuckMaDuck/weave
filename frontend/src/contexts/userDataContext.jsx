import React, { createContext, useEffect, useState } from 'react';
import {LoadingScreen} from '../components/export';
const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

 function getData(){
  
    const request = new Request("/backend/loadCreds.php", {
        method: 'POST',
        credentials: 'include'
      }
    )
    fetch(request)
    .then((response) =>{
      
      if (response.ok){
        return(response.json())
        
      } 
      else{

      }
    })
    .then((data)=> {
      console.log(data)
      setUserData(data)
    
    })

  }
  useEffect(()=>{
    getData();
  } , [])

  if(!Object.keys(userData).length){
   
    return(<LoadingScreen state={1} />)
  }
  return (
    <UserDataContext.Provider value={{ userData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };