//import MenuItem from '@material-ui/core/MenuItem';
import React, { useState } from 'react';
import {
    List,
    ListItemText,
    Container,
    IconButton,
    Paper,
    ListItemButton,
    Snackbar,
    Alert,
} from '@mui/material';
import LOGO from '../assets/images/LOGO.png';
import { Link, useLocation } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap-v5';
import UserPage from './UserPage';
import { getUserEmail } from '../services/apiRest';

const UserPanel = () => {

    const location = useLocation();
    const [activePanel, setActivePanel] = useState('');
    const [name, setName] = useState("");
    const use = location.state.email;
    const pass = location.state.password;
    const admin =  location.state.admin;
    const [show, setShow] = useState();
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioselect1, setUsuarioSelect1] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
        name: '',
        email: '',
        readonly: false,
        administrator: false,
        password: 'tracker1234',
        disabled: false,
        expirationTime: '',
        deviceLimit: 0,
        userLimit: 0,
        deviceReadonly: false,
        limitCommands: false,
        celular: null,
        direccion: null,
        ciudad: null,
        contactoe: null,
        observaciones: null,
        telefonoe: null,
    });
    const tokenO = location.state.tokenO;
    const token = location.state.token;
    const [creatingUser, setCreatingUser] = useState(true);

    // Función para manejar el clic en una opción del menú
    const handleMenuItemClick = (panelName) => {
        setActivePanel(panelName);
        setCreatingUser(panelName === 'createUser');
        // Si seleccionas 'CREAR USUARIO', establece el usuario seleccionado en un objeto vacío
        if (panelName === 'createUser') {
            setUsuarioSeleccionado({ ...usuarioSeleccionado });
        }else{
            console.log("Entro");
        };
    };

    /* async function obtenerDispositivos() {
       const response = await getDeviceImei(imei, tokenO);
       setDispositivos(response.data);
   
     }*/

    async function obtenerUsuarios() {
        const response = await getUserEmail(name, tokenO);
        //console.log(response.data);
        if (response.data.length === 0) {
            setShow(true);
            setTimeout(() => {
              setShow(false);
            }, 3000);
          }
        setUsuarios(response.data);

    }

    const obtenerUsuarioSeleccionado = async (user) => {
        setUsuarioSelect1({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            attributes: JSON.parse(user.attributes),
            readonly: user.readonly,
            administrator: user.administrator,
            disabled: user.disabled,
            expirationTime: user.expirationtime,
            deviceLimit: user.devicelimit,
            userLimit: user.userlimit,
            deviceReadonly: user.devicereadonly,
            limitCommands: user.limitcommands,
            celular: user.celular,
            direccion: user.direccion,
            ciudad: user.ciudad,
            contactoe: user.contactoe,
            observaciones: user.observaciones,
            telefonoe: user.telefonoe,
        });
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <nav className="navbar navbar-expand-lg navbar-light bg-warning">
                <div className="container-fluid">
                    <span className="navbar-brand">
                        <img src={LOGO} alt="" width="30" height="24" className="d-inline-block align-text-top" />
                        TRACKER X
                    </span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                                <Link to={"/pruebasPage"} state={{ email: use, password: pass, tokenO: tokenO, token: token, admin:admin }} className="nav-link">PRUEBAS</Link>
                        </li>
                        <li className='nav-link' onClick={() => handleMenuItemClick('updateUser')}>
                        MODIFICAR USUARIO
                        </li>
                        <li className='nav-link' onClick={() => handleMenuItemClick('createUser')}>
                        CREAR USUARIO
                        </li>
                        </ul>
                        <Link to={"/pruebasLogin"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
                    </div>
                </div>
            </nav>
            <div style={{ display: 'flex', flex: 1 }}>
                <div className="content-panel" style={{ flex: '1', padding: '20px' }}>
                    {/* Paneles de contenido */}
                    {creatingUser && admin !== 4 && (
                        <Container maxWidth="100%" style={{ height: '80%' }}>
                            <Row>
                                <Col style={{ marginTop: '10px' }}>
                                    <UserPage user={usuarioSeleccionado} setUser={setUsuarioSeleccionado} opcion={1} token={token}  admin={admin}></UserPage>
                                </Col>
                            </Row>
                        </Container>
                    )}
                    {activePanel === 'updateUser' && (
                        <Container>
                            <Col>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente"
                                        style={{ height: '30px', marginRight: '10px' }} // Ajusta la altura aquí
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <IconButton size="small" title="Informacion" style={{ height: '30px' }} onClick={obtenerUsuarios}>
                                        BUSCAR
                                    </IconButton>
                                </div>
                                <Paper elevation={3} style={{ maxHeight: '100px', overflow: 'auto', marginTop: '4px' }}>
                                    <List>
                                        {usuarios.map(user => (
                                            <div key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemButton onClick={() => obtenerUsuarioSeleccionado(user)}>
                                                    <ListItemText primary={user.email} secondary={`${user.name}`} />
                                                </ListItemButton>
                                            </div>
                                        ))}
                                    </List>
                                </Paper>
                                <UserPage user={usuarioselect1} setUser={setUsuarioSelect1} opcion={2} token={token}  admin={admin}></UserPage>
                            </Col>
                        </Container>
                    )}
                </div>
            </div>
            <Snackbar open={show} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} style={{
                top
                : '14%', right: '40px'
            }} >
                <Alert variant="outlined" severity="warning" sx={{ background: '#ffff' }} >
                USUARIO NO ENCONTRADO
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UserPanel;
