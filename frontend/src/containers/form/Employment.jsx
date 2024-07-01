import React from 'react'

const Employment = (props) => {


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
              <label>Employment Position One<span> {err.hasOwnProperty('positionOne')? setError("positionOne") :""}  </span>  </label>
              <textarea name="positionOne" className={err.hasOwnProperty('positionOne') ? "err":""}></textarea>
      </div>

      <div className='input-field'>
              <label>Employment Position Two<span> {err.hasOwnProperty('positionTwo')? setError("positionTwo") :""}  </span>  </label>
              <textarea name="positionTwo" placeholder='Optional' className={err.hasOwnProperty('positionTwo') ? "err":""}></textarea>
      </div>

      <div className='input-field'>
              <label>Employment Position Three<span> {err.hasOwnProperty('positionThree')? setError("positionThree") :""}  </span>  </label>
              <textarea name="positionThree"  placeholder='Optional'  className={err.hasOwnProperty('positionThree') ? "err":""}></textarea>
      </div>
        
      <div className='input-field'>
              <label>Employment Position Four<span> {err.hasOwnProperty('positionFour')? setError("positionFour") :""}  </span>  </label>
              <textarea name="positionFour"  placeholder='Optional' className={err.hasOwnProperty('positionFour') ? "err":""}></textarea>
      </div>
    </div>
  )
}

export default Employment