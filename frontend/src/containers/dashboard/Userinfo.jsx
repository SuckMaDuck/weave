import React, { useContext } from 'react';
import { UserDataContext } from "../../contexts/userDataContext";
import {FoeCard} from '../../components/export'; 

const Userinfo = () => {
  const { userData } = useContext(UserDataContext);

  const keysArray = Object.keys(userData)
  const nonNullFoeKeys = keysArray.filter((key, index)=>{
      if(userData[key] != null && key.includes("FOE")){
        return(key);
      };
  })

const nonNullkeys =  nonNullFoeKeys.map((key)=>{
  return({
      foe:key, 
      yoe:key.replace("FOE","YOE")
  })
})


  return (
    <div className='userinfo'>
      <div className='overview-header'>
        <h1>Hello, {userData["first_name"]}</h1>
        <h2>You are currently applying for {userData["role"]} position</h2>
      </div>
      <div className='first-info-section'>
        <div className='foe-container'>
          {nonNullkeys.map((pair, index) => (
            <FoeCard key={index} foeKey={pair.foe} value={userData[pair.foe]} yoeKey={pair.yoe} years={userData[pair.yoe]} />
          ))}
        </div>

        <div className='education-background'>
            <div className='logo-container'>
              <figure></figure>
              <div className="edit-icon" ></div>

            </div>
        </div>
      </div>
  
    </div>
  );
}

export default Userinfo;