import React, { useState } from 'react';
import positions from "../../positions.json"
const FoeCard = ({ value, years, foeKey, yoeKey }) => {
  const maxBar = 10;
  const [formState, setFormState] = useState(false);
  const [data, setData] = useState({
    foe: value,
    yoe: years
  });
  const[formErr, setFormErr] = useState(false)
  let width = `${((data.yoe / maxBar) * 100) <= 100 ? ((data.yoe / maxBar) * 100) : 100}%`;
  function editFoe(e) {
    e.preventDefault();
    e.target[yoeKey].value= e.target[yoeKey].value || data.yoe
    e.target[foeKey].value= e.target[foeKey].value || data.foe

    const formData =  new FormData(e.target)
    const request = new Request("backend/updateFOE.php", {
      method: "POST",
      credentials: "include",
      body: formData
    })
  
    fetch(request)
      .then((response) => {

        if (response.ok) {
          
          return(response.json())
        }
      })
      .then((jsonData)=>{
        console.log(jsonData)
        if(jsonData.status == false){
        
          setFormErr(true)
        }

        else{
          setData({
            foe: formData.get(foeKey) || data.foe,
            yoe: formData.get(yoeKey) || data.yoe
          }
        )
        setFormState(false);
        setFormErr(false);

        }
      
  
      })
      .catch(error => {
        console.log("yo mama a hoe")
      });
  }  
  return (
    <div className='foe-card'>
      <div className='logo-container'>
        <figure></figure>
        <div className="edit-icon" onClick={() => setFormState(true)} style={formState ? { display: "none" } : { display: 'block' }}></div>
        <div className='close-icon' onClick={() => setFormState(false)} style={formState ? { display: "block" } : { display: 'none' }}></div>
      </div>

      <form id='foe-form' onSubmit={editFoe}>
        <div className='foe-value'>
          <h2 style={formState ? { display: 'none' } : { display: "block" }}>{data.foe}</h2>
          <select placeholder={data.foe} name={foeKey}  style={formState ? { display: 'block' } : { display: "none" }} > 
              {positions.positions.map((v, i)=>{
                return(<option key={i} value={v}>{v}</option>)
              })}

          </select>
        </div>

        <div className='yoe-value'>
          <h3 style={formState ? { display: 'none' } : { display: "block" }}>{data.yoe} years of practice</h3>
          <input type="number" name={yoeKey} placeholder={data.yoe} style={formState ? { display: 'block' } : { display: "none" }} min={1} max={30} className={formErr? "card-err": ""}/>
        </div>
        <button className='check-icon' style={formState ? { display: 'block' } : { display: "none" }}></button>
      </form>

      <div className='loader-skeleton'>
        <span style={{ width: width }}></span>
      </div>  
    </div>
  );
}

export default FoeCard;