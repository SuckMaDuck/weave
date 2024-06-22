import React, {useMemo, useState} from 'react'
import { Bg, Formicon, LoadingScreen} from "../../components/export.js"
import {Creds, Exp, JobPrefrences, PersonalInfo, Employment, Education} from "../../containers/export.js"
import { useNavigate } from 'react-router-dom'

const Register = () => {
const lastblock = 6;
const[loader, setLoader] = useState(0);
const nav = useNavigate();
const[Err, setErr] = useState(0);
const[errorData, setErrData]= useState({})
const[form, setForm] = useState(1)

const FormIcon = React.memo(({id , state, form , label, img })=>{
  return(
    <Formicon id={id} state={state} form={form} label ={label} img={img} />
  )
  })

const formComponenets = useMemo(()=>{
  return(
        <>
        <PersonalInfo state={form} id="1"  errState={Err} err={errorData}  />
        <Creds state={form}  id="2" errState={Err} err={errorData}/>
        <Exp state={form}  id="3" errState={Err} err={errorData} />
        <Employment state={form}  id="4" errState={Err} err={errorData} />
        <Education state={form}  id="5" errState={Err} err={errorData} />
        <JobPrefrences state={form} id="6"  errState={Err} err={errorData}/>
        </>
  )
}, [form, errorData, Err])

function regUser(e){
setLoader(1)
const formData = new FormData(e.target);
formData.append('block', form);
e.preventDefault();
const xhr = new XMLHttpRequest()
xhr.open("POST", "/api/register.php", true)

xhr.onload = function(){
setLoader(0);
if(this.status == 200){
const erros = JSON.parse(this.response);
      setErrData(erros)
     if(Object.keys(erros).length == 0){
        (form != lastblock) ? 
        nextBlock()&& setErr(0)
        :
        nav("/login");
        ""
       }

     }
     else{
       setErr(1)

     }
    }
  xhr.onerror =  function(){
    setLoader(0);
  }

    xhr.send(new URLSearchParams(formData));
  }
function nextBlock(){
if(form <lastblock){
setForm(prev=>prev+1)

}
}

function prevBlock(){
if(form > 0){
setForm(prev=>prev-1)
}

}

return (
<>
<LoadingScreen state={loader} />
<Bg />

<div className='regform-container'>
    <div className='regform-wrapper' >
      <ul className='formicons'>
        <FormIcon id="1" state={form} label="Personal Info." img="url('/images/icons/person.png')"/>
        <span className= {form >=1?'progress-bar progress-bar-active' : 'progress-bar'}></span>

        <FormIcon  id="2" state={form} label="Contact Info." img="url('/images/icons/contact-us.png')"/>
        <span  className={form >=2?'progress-bar progress-bar-active' : 'progress-bar'}></span>

        <FormIcon  id="3" state={form} label="Experience Info." img="url('/images/icons/briefcase.png')"/>
        <span className={form >=3?'progress-bar progress-bar-active' : 'progress-bar'}></span>

        <FormIcon  id="4" state={form} label="Employment Info." img="url('/images/icons/job.png')"/>
        <span className={form >=4?'progress-bar progress-bar-active' : 'progress-bar'}></span>

        <FormIcon  id="5" state={form} label="Education info." img="url('/images/icons/education.png')"/>
        <span className={form >=5?'progress-bar progress-bar-active' : 'progress-bar'}></span>
        
        <FormIcon  id="6" state={form} label="Job Preferences." img="url('/images/icons/preferences.png')"/>
      </ul>
        <form method='POST' className='regform' id="regform" onSubmit={regUser}  autoComplete="off" >
          
          {formComponenets} 

         </form>
        <div className='form-btnZ-container'>
          <div className='btnz'>
              <button className={form != 1? 'form-btn' : "hide-btn"} onClick={prevBlock}>Back</button>
              <button className={form != lastblock? 'form-btn' : "hide-btn"} form='regform' >Continue</button>
              <input className={form == lastblock? 'form-btn' : "hide-btn"} type='submit' form='regform' value="Submit" />
          </div>
        </div>
    </div>
</div>

</>
)
}

export default Register