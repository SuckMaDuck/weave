import React from 'react'




const Creds = (props) => {

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

      <div className='input-field' >
              <label>Email <span> {err.hasOwnProperty('email')? setError("email") :""}  </span>  </label>
              <input type="email" name='email' className={err.hasOwnProperty('email') ? "err":""}/>
      </div>

      <div className='input-field'>
              <label>Phone Number <span> {err.hasOwnProperty('number')? setError("number") :""} </span> </label>
              <input type="text" name='number' className={err.hasOwnProperty('number') ? "err":""} />
      </div>

      <div className='input-field'>
              <label>Password <span>{err.hasOwnProperty('password')? setError("password") :""} </span></label>
              <input type="password" name='password' className={err.hasOwnProperty('password') ? "err":""} />
      </div>
      
      <div className='input-field'>
              <label>Confirm Password <span> {err.hasOwnProperty('confirmPassword')? setError("confirmPassword") :""} </span></label>
              <input type="password" name="confirmPassword" className={err.hasOwnProperty('confirmPassword') ? "err":""}/>
      </div>
      <div className='input-field'>
              <label>Personal Links <span> {err.hasOwnProperty('personalLinks')? setError("personalLinks") :""} </span></label>
              <input placeholder="Github/Linkedin or any other relevant links (Optional)" type="text" name="personalLinks" className={err.hasOwnProperty('personalLinks') ? "err":""}/>
      </div>
    </div>
  )
}

export default Creds

