import React, { useContext } from 'react';
import { UserDataContext } from "../../contexts/userDataContext";
import {FoeCard} from '../../components/export'; 

const Userinfo = () => {
  const { userData } = useContext(UserDataContext);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = new Date();
  const day = days[date.getDay()];
  const formattedDate = `${day}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

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
        <h2>Today is {formattedDate}</h2>
      </div>
      <div className='foe-container'>
        {nonNullkeys.map((pair, index) => (
          <FoeCard key={index} foeKey={pair.foe} value={userData[pair.foe]} yoeKey={pair.yoe} years={userData[pair.yoe]} />
        ))}
      </div>
    </div>
  );
}

export default Userinfo;
