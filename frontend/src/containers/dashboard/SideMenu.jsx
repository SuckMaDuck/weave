import React, { useState, useContext } from 'react'
import { LoginContext } from '../../contexts/LoginContext.jsx'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from "../../contexts/userDataContext";
import {Links} from '../../components/export.js'


const SideMenu = ({name}) => {


  const nav = useNavigate();
  const[state, setState] = useState(0);
  const {isLoggedIn ,setIsLoggedIn } = useContext(LoginContext);
  const { userData } = useContext(UserDataContext);
  const [pfpForm, setPfpForm] = useState(false);
  const pfpUrl = `backend/${userData["pfp"]}`;

  const [imgUrl, setImgUrl] = useState(pfpUrl)

  function logout(){

    const request = new Request("backend/logout.php",{
      method:"POST",
    })

    fetch(request)
    .then((response)=>{
      if(response.ok){
        setIsLoggedIn(false);
         nav("/login")
      }
    })

  }


  function updatePhoto(e){
    e.preventDefault();
    const request = new Request("backend/pfp.php",{
      method: "POST",
      credentials: "include",
      body: new FormData(e.target)
    })
    fetch(request)
    .then((response)=>response.json())
    .then(data => {
      console.log(data)
      if(data.status == true){
        setPfpForm(false);
      }

    })

    
  }

  function imagrePreview(e){
    const file = e.target.files[0];
    if(validateFile(file) === true){
      const reader = new FileReader();
      reader.onload = function(e){
        setImgUrl(e.target.result);
      }
      reader.readAsDataURL(file);
     
    }
    else{
      e.target.value = null;
      setImgUrl(null)
    }
  

  }
  const validateFile = (file) => {
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif'];
    if (validExtensions.includes(file.type) && file.size < 10000000) {
      return(true)
    } 
    else {
      return(false);
      
    }
  };

  return (
    <>
    <div className= {'shady-bg'  + (state == 1? " slide" : " delay")}></div>
        <div className={'logo-container controller'  + (state == 1? " slide-up" : "")} style={{display:'none'}}>
            <figure onClick={()=>{setState(1)}}></figure>
          
        </div>
      <nav className={'navBar' + (state == 1? " slide" : "")}>
          <div className='logo-container'>
                <figure ></figure>
                <div className='close-x' onClick={()=>{setState(0)}}></div>
                <h1 style={{fontFamily: "Poppins"}}>Weave</h1>
          </div>


          <div className='pfp-container'>
              <figure>
                <form onSubmit={updatePhoto} id='pfp' style={pfpForm? {display:"block"} : {display:"none"}}>
                  <input type="file" className='pfp-input'  onChange={imagrePreview} multiple={false}  accept="image/*"  name='pfp'/>
                  <button form='pfp'>  </button>
                  <button form=''  onClick={()=>{setPfpForm(false); setImgUrl(pfpUrl)}}>  </button>
                </form>
                <div id='actual-photo' style={ { backgroundImage: `url(${imgUrl})` }}> </div>
                <div className='edit-icon' onClick={()=>{setPfpForm(true)}} style={pfpForm? {display:"none"} : {display:"block"}} ></div>
              </figure>
            <div className='name-email-container'>
                <h1 className='userinfo-name'>{`${userData["first_name"]} ${userData["last_name"]}`}</h1>
                <h2 className='userinfo-email'>{userData.email}</h2>
            </div>

          </div>


          <div className='links-container'>
            <Links name="Overview"  img='URL(/images/icons/resume.png)' makeActive={name}  />
            <Links name="Jobs" img='URL(/images/icons/employee-man.png)' makeActive={name}  />
            <Links name="Companies" img='URL(/images/icons/corporate-alt.png)' makeActive={name} />
            <Links name="Settings"  img='URL(/images/icons/settings.png)'  makeActive={name} />
            <Links name="Support"  img='URL(/images/icons/user-headset.png)' makeActive={name} />
      
          </div>

          <div className='log-out' onClick={()=>{logout()}}>
            <h2>Logout</h2>
            <figure></figure>
          </div>

          <div className="custom-shape-divider-bottom-1718045686">
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                  <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                  <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
              </svg>
          </div>
      </nav>
    </>
  )
}

export default SideMenu