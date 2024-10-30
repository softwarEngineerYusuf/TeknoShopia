import React from 'react'
import '../Login/Login.css'
function Login() {
  return (
    <>
    <div className='LoginPageMain'>
     
     <div className='boxOfLogin'>
     <div className='LoginAndRegisterButtonLgn'>
     <div className='UnderLoginAndRegisterButtonLgn' style={{backgroundColor:'##2C2C2C'}}><button>Login</button></div>
     <div className='UnderLoginAndRegisterButtonLgn' style={{backgroundColor:'#2C2C2C',borderRadius:'10px',color:'white',padding:'3px 8px'}}><button>Register</button></div>
     </div>
     <div className='allInputsLgn'>
     <div><input className='inputsOfLoginLgn' type="email" name="E-Posta" placeholder="E-Posta" /></div>
     <div><input className='inputsOfLoginLgn' type="password" placeholder="Password"/></div>
     </div>
     <div>
     <div className='loginButtonLogin'><button>Login</button></div>
     <div className='forgotPasswordLink'> <a href="">Forgot Password</a> </div>
     </div>
    </div>
    </div>
    
    </>
  )
}
    
export default Login