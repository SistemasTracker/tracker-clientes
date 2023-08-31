import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';

// import EventsDrawer from './eventsDrawer';

const Login1 = () => {

  const url = 'https://tracker.com.ec';
  // const token = new URLSearchParams(window.location.search).get('token');

  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const validarToken = () => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('GET', `${url}/api/session?token=${token}`, true);
    xhr.onreadystatechange = () => {
      if (xhr.status === 200) {
        navigate('/eventos', {state: {token}})
      }else{
        console.error('ERROR EN LA PETICION');
      }
    };
    xhr.send();
  };
  
  return  (
    <>
     <div className="wrapper fadeInDown">
     <div id="formContent"> 
        <div className="fadeIn first">
            <img src={LOGO} id="icon" alt="User Icon"/>
        </div>                     
        <input type="text" placeholder="TOKEN DE ACCESO" value={token} onChange={(e) => setToken(e.target.value)} />
        <input type="button" className="fadeIn fourth" value="INICIAR SESIÓN" onClick={validarToken}/>              
     </div>
     <br></br>
     <br></br>
     </div>
     </>
  )
  };
  
export default Login1;