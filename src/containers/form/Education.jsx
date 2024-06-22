import React from 'react'


const Education = (props) => {


    let status;
    if(props.state == props.id ){
      status = "form-block"
  
    }
    if(props.state < props.id){
      status = "form-block slide-in-right"
    }
    if(props.state > props.id){
      status = "form-block  slide-in-left"
    }
    let warning = "";
    let err = props.err
    if(props.errState){
  
      warning = "err";
    }
  
    function setError(key){
      return(`* ${err[key]}`);
    }




  return (
    <div className= {status}>
     <div className='input-field'>
              <label>Personal Background<span> {err.hasOwnProperty('personalBackground')? setError("personalBackground") :""}  </span>  </label>
              <textarea name="personalBackground" className={err.hasOwnProperty('personalBackground') ? "err":""}></textarea>
      </div>

      <div className='input-field'>
              <label>College Degrees<span> {err.hasOwnProperty('collegeDegrees')? setError("collegeDegrees") :""}  </span>  </label>
              <textarea name="collegeDegrees" className={err.hasOwnProperty('collegeDegrees') ? "err":""}></textarea>
      </div>

      <div className='input-field'>
              <label>Additional Education<span> {err.hasOwnProperty('additionalEducation')? setError("additionalEducation") :""}  </span>  </label>
              <textarea name="additionalEducation" className={err.hasOwnProperty('additionalEducation') ? "err":""}></textarea>
      </div>
        
    </div>
  )
}

export default Education