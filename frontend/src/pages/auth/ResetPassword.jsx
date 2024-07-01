import React, { useState } from 'react'
import Bg from '../../components/Bg'
import { ResetPasswordBlock } from '../../containers/export.js';
import {LoadingScreen} from "../../components/export.js"
import { useNavigate } from 'react-router-dom';
const ResetPassword = ({}) => {

    const [block, setBlock] = useState(1);
    const [err, setErr] = useState({status: null, message: null})
    const [loader, setLoader] =  useState(0)
    const nav =  useNavigate();

    function backTologin(){
        setTimeout(function(){nav("/login")}, 3000);
    }
    function sendVerificationEmail(e){
        setLoader(1);
        e.preventDefault()

        const request = new Request("backend/requestResetPasscode.php", {
                method:"POST",
                credentials:"include",
                body: new FormData(e.target)
            }

        )

        fetch(request)
        .then((response)=>{

            return(response.json())
        })
        .then((data)=>{
            setLoader(0)
            if(data.status=== true){
                setErr({status: null, message: null})
                setBlock(2);
            }else{
                setErr(data);
            }
           
        
            
        })
        .catch(err=>err)
    }

    function verifyPasscode(e){

        setLoader(1);
        e.preventDefault()

        const request = new Request("backend/validateResetPasscode.php", {
                method:"POST",
                credentials:"include",
                body: new FormData(e.target)
            }

        )

        fetch(request)
        .then((response)=>{

            return(response.json())
        })
        .then((data)=>{
            setLoader(0)
            if(data.status=== true){
                setErr({status: null, message: null})
                setBlock(3);
            }else{
                setErr(data);
            }
           
        
            
        })
        .catch(err=>err)

    }

    function updatePassword(e){
        setLoader(1);
        e.preventDefault()

        const request = new Request("backend/createNewPassword.php", {
                method:"POST",
                credentials:"include",
                body: new FormData(e.target)
            }

        )

        fetch(request)
        .then((response)=>{

            return(response.json())
        })
        .then((data)=>{
            setLoader(0)
            if(data.status=== true){
                setErr(data)
                setBlock(4)
                backTologin();
            }else{
                setErr(data);
            }
           
        
            
        })
        .catch(err=>err)

    }
   
  return (
    <>      
        <LoadingScreen state={loader} />
        <Bg />
            <div className='form-wrapper'>
                <ResetPasswordBlock onSubmit={sendVerificationEmail} block={block} err={err} id={1}>
                    
                    <header className='reset-password-header'>
                            <h1>Reset Your Password</h1>
                            <p>Please enter your email address below. We'll send you an email to proceed with resetting your password.</p>
                        </header>
                        <div className='input-field' >
                            <input type="email"  name='email' className={err.status === false?'err': ''}/>
                    </div>
                        
                </ ResetPasswordBlock>
            
                <ResetPasswordBlock onSubmit={verifyPasscode} block={block} err={err} id={2}>
                    
                    <header className='reset-password-header'>
                            <h1>Check your email</h1>
                            <p>Please check your email and enter the verification code.</p>
                        </header>
                        <div className='input-field' >
                            <input type="text"  name='passcode' className={err.status === false?'err': ''}/>
                    </div>
                        
                </ ResetPasswordBlock>

                <ResetPasswordBlock onSubmit={updatePassword} block={block} err={err} id={3}>
                    
                        <header className='reset-password-header' style={{marginBottom:"1rem"}}>
                            <h1>Create a new password</h1>
                            <p>Create a new password, and don't forget it again moah(:</p>
                        </header>
        
                        <div className='input-field' >
        
                            <input type="password"  placeholder='Password' name='password' className={err.status === false?'err': ''}/>
                            
                        </div>
                        <div className='input-field' >
                        
                            <input type="password" placeholder='Confirm password'  name='confirmPassword' className={err.status === false?'err': ''}/>
                        </div>
                        
                </ ResetPasswordBlock>

               
                <ResetPasswordBlock onSubmit={""} block={block} err={err} id={4}>
                    
                        <header className='reset-password-header' style={{marginTop:"-5rem"}}>
                            <h1 style={{opacity:"", fontSize:"1.3rem"}}>Your password has been reset.</h1>
                            <p>Please Don't bother us again ):</p>
                        </header>
        
                        
                </ ResetPasswordBlock>
              
            </div>
    </>
   
  )
}

export default ResetPassword