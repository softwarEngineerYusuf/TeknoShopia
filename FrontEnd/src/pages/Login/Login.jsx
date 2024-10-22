import React from 'react'
import '../Login/Login.css'

function Login() {
  return (
    <>
    <div className='LoginPageMain'>
     
     <div className='LoginAndRegisterButton'>
     <div className='UnderLoginAndRegisterButton' style={{backgroundColor:'##2C2C2C'}}><button>Login</button></div>
     <div className='UnderLoginAndRegisterButton'><button>Register</button></div>
     </div>

     <div><input className='inputsOfLogin' type="text" name="Ad Soyad" placeholder='Ad Soyad' /></div>
     <div><input className='inputsOfLogin' type="email" name="E-Posta" placeholder="E-Posta" /></div>
     <div><input className='inputsOfLogin' type="tel" placeholder="(5XX) XXX XX XX"/></div>
     <div><input className='inputsOfLogin' type="checkbox"/> İletişim izinleri </div>
     <div><button>Login</button></div>

    </div>
    </>
  )
}
    
export default Login
