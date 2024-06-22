import React from 'react'

const JobPrefrences = (props) => {
    
    let status;
    if(props.state == props.id ){
      status = "form-block"
    }
    if(props.state < props.id){
      status = "form-block slide-in-right"
    }
    if(props.state > props.id){
      status = "form-block slide-in-left"
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
              <label>Preferred Role  <span> {err.hasOwnProperty('role')? setError("role") :""}  </span>  </label>
              <input type="text" name='role' className={err.hasOwnProperty('role') ? "err":""} />
      </div>

      <div className='input-field'>
              <label>Expected Salary <span> {err.hasOwnProperty('salary')? setError("salary") :""}  </span>  </label>
              <input type="number" name='salary' min={2000}  step={1000} className={err.hasOwnProperty('salary') ? "err":""} />
      </div>
      
      <div className='input-field'>
              <label>Long Term Vision <span> {err.hasOwnProperty('vision')? setError("vision") :""}  </span>  </label>
              <textarea name="vision" className={err.hasOwnProperty('vision') ? "err":""} ></textarea>
      </div>
            
      <div className='input-field'>
              <label>Additional Notes <span> {err.hasOwnProperty('notes')? setError("notes") :""}  </span>  </label>
              <textarea name="notes" className={err.hasOwnProperty('notes') ? "err":""}></textarea>
      </div>
    </div>
  )
}

export default JobPrefrences