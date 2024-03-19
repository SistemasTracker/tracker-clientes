import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
import { authLogin } from '../services/apiRest';


// import EventsDrawer from './eventsDrawer';

const PruebasLogin = () => {

  const url = 'https://tracker.com.ec';
  // const token = new URLSearchParams(window.location.search).get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [token, setToken] = useState('');

  
  const iniciarSesion = async (event) => {
    const values = {
      name: email,
      password: password
    }  
    try {
      const dataAuth = await authLogin(values);
      const admin = dataAuth.data.admin;
      console.log(dataAuth);
      if(admin === 3 || admin === 4 ){
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.open('GET', `${url}/api/session?token=${token}`, true);
          xhr.onreadystatechange = () => {
            if (xhr.status === 200) {
              navigate('/pruebasPage', {state: {token: token, tokenO: dataAuth.data.accessToken, email: email, password: password, admin: admin}})
            }else{
              console.error('ERROR EN LA PETICION');
            }
          };
          xhr.send();
        } else {
          console.error('ERROR EN LA PETICION');
        }
    } catch (error) {
      setShowError(true);
    }
     
      
  };

  return  (
    <>
     <div className="wrapper fadeInDown">
     <div id="formContent"> 
        <div className="fadeIn first">
            <img src={LOGO} id="icon" alt="User Icon"/>
        </div>                     
        <input type="text" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="CONTRASEÑA" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="TOKEN" value={token} onChange={(e) => setToken(e.target.value)} />
        <input type="button" className="fadeIn fourth" value="INICIAR SESIÓN" onClick={iniciarSesion}/>         
     </div>
     <br></br>
     <br></br>
     
     <div>
     <br></br>
      <br></br>
      {showError && <p className="text-danger"> Usuario o contraseña incorrectos. Inténtalo nuevamente.</p>}
      </div>
      </div>
      </>
  )
  };
  
export default PruebasLogin;