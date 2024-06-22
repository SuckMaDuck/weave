import React, { useState } from 'react'
import {ExpField} from '../../components/export';




const Exp = (props) => {


  let status;
  if(props.state == props.id ){
    status = "form-block exp"

  }
  if(props.state < props.id){
    status = "form-block exp slide-in-right"
  }
  if(props.state > props.id){
    status = "form-block exp  slide-in-left"
  }




const [exp, setExp] = useState([])

function addField(){
 if(exp.length <3){
  let newField ={id: (Math.random()) +(Date.now())}; 
    setExp((prev)=>[...prev , newField]);
  

};
}
 function removeField(index){
  const delField = [...exp];
  delField.splice(index, 1);
  setExp(delField)


 }



  return (
    <div className={status}>
      <div className='exp-header' style={{position: 'relative'}}>
          <label htmlFor="">Field Of Practice</label>
          <label htmlFor="">Years Of Experience</label>
          <button form=''  onClick={addField}className='exp-btn exp-add'>+</button>
      </div>

  <ExpField  id="og"  err = {props.err}/>
  {exp.map((field, index) => (
        <ExpField key={field.id} id={index +2} onRemove={()=>{removeField(index)}} err={props.err} />
      ))}

    </div>
  
  )
}


export default Exp