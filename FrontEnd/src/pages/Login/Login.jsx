import React, { useState } from 'react';
import '../Login/Login.css'

const LoginForm = ({ toggleForm }) => {
  return (
    <div className='LoginPageMain'>
     
      <div className='LoginAndRegisterButton'>
      <div className='LoginInRegisterPage'><h2>Login</h2></div>
      <div className='RegisterInRegisterPage'><button onClick={toggleForm}>Register</button></div>
      </div>

      <form>
        <div>
          <input className='inputsLoginAndRegister' type="email" placeholder="E Posta" />
        </div>
        <div>
       <input className='inputsLoginAndRegister' type="password" placeholder="Password " />
        </div>
        <button className='ButtonOfSubmit' type="submit">Login</button>
      </form>
    </div>
  );
};

const RegisterForm = ({ toggleForm }) => {
  return (
    <div  className='LoginPageMain'>
     
     <div className='LoginAndRegisterButton'>
       <div className='RegisterInLoginRegisterPage'><h2>Register</h2></div>
      <div className='LoginButtonInLoginRegisterPage'><button onClick={toggleForm}>Login</button></div> 
      </div>

      <form>
        <div>
          <input className='inputsLoginAndRegister' type="text" placeholder='Name Surname' />
        </div>
        <div>
          <input className='inputsLoginAndRegister' type="email" placeholder="E Posta" />
        </div>
        <div>
          <input className='inputsLoginAndRegister' type="tel" placeholder='(5xx) xxx xx xx' />
        </div>
        <div>
          <input className='inputsLoginAndRegister' type="text" placeholder='Password' />
        </div>
        <div>
          <input className='inputsLoginAndRegister' type="text" placeholder='Password again' />
        </div>
        <div className='checkboxInRegister'><input type="checkbox" /> KVKK izinlerini onaylıyorum.</div>
        <button className='ButtonOfSubmit'  type="submit">Register</button>
      </form>

    </div>
  );
};

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {isLogin ? <LoginForm toggleForm={toggleForm} /> : <RegisterForm toggleForm={toggleForm} />}
    </div>
  );
};

export default App;
