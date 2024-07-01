import countries from './../../countries.json'




const PersonalInfo = ({id, state, errState, err}) => {
  let status;
  if(state == id){
    status = "form-block"
  }
  if(state > id){
    status = "form-block slide-in-left"
  }
  let warning = "";
  if(errState){

    warning = "err";
  }

  function setError(key){
    return(`* ${err[key]}`);
  }


  return (
    <div className={ status}>
      <div className='input-field'>
              <label>First Name  <span> {err.hasOwnProperty('firstName')? setError("firstName") :""} </span></label>
              <input type="text" name='firstName'  className={err.hasOwnProperty('firstName') ? "err":""}    />
      </div>

      <div className='input-field'> 
          <label>Last Name <span> {err.hasOwnProperty('lastName')? setError("lastName") :""} </span> </label>
          <input type="text" name='lastName' className={err.hasOwnProperty('lastName') ? "err":""}  />
      </div>
        

      <div className='input-field'>
          <label>Date Of Birth <span> {err.hasOwnProperty('birthDay')? setError("birthDay") :""} </span> </label>
          <input type="date" name='birthDay' className={err.hasOwnProperty('birthDay') ? "err":""}  />
      </div>
          
          
      <div className='input-field'>
          <label>Gender<span> {err.hasOwnProperty('gender')? setError("gender") :""} </span> </label>
         <select name="gender"  className={err.hasOwnProperty('gender') ? "err":""}  >
              <option value=""> Select Gender </option>
              <option value="Male"> Male </option>
              <option value="Female"> Female </option>
          </select>
      </div>
          
      <div className='input-field'>
        <label>Country <span> {err.hasOwnProperty('country')? setError("country") :""} </span></label>
        <select name="country"  className={err.hasOwnProperty('country') ? "err":""}  >
        <option value="" >Select country</option>
            {countries.map((country)=>{
            return(
              <option value={country.name} key={country.code}>{country.name}</option>
               )
                
             })}
        </select>
     </div>
     

    </div>
  
  )
}

export default PersonalInfo
