/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Container,
    IconButton,
    Paper,
    ListItemButton,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Typography,

} from '@mui/material';
import LOGO from '../assets/images/LOGO.png';
import { Link, useLocation } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap-v5';
import moment from 'moment';
import { getDeviceImei } from '../services/apiRest';
import MapRoute from '../Map/MapRoute';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';


const Reportpanel = () => {

    const location = useLocation();
    const [activePanel, setActivePanel] = useState('');
    const [cliente, setCliente] = useState("");

    const tokenO = location.state.tokenO;
    const token = location.state.token;
    const use = location.state.email;
    const pass = location.state.password;
    const admin = location.state.admin;
    const url = location.state.url;
    const [dispositivos, setDispositivos] = useState([]);
    const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState({});
    const [fechaDesde, setFechaDesde] = useState();
    const [fechaHasta, setFechaHasta] = useState('');
    const [posicionSeleccionada,setPosicionSeleccionada] = useState([]);
    const [ruta, setRuta] = useState([]);
    const [eventos, setEventos] = useState([]);

    const handleBotonClick = (posicion) => {
        setPosicionSeleccionada(posicion);
        console.log(posicionSeleccionada);
      };
    
    useEffect(() => {
        // Obtener la fecha y hora actual
        const now = new Date();

        // Formatear la fecha y hora para el campo datetime-local
        const formattedDateTime = `${now.getFullYear()}-${formatTwoDigits(
            now.getMonth() + 1
        )}-${formatTwoDigits(now.getDate())}T00:00`;

        // Establecer la fecha y hora inicial en el estado local
        setFechaDesde(formattedDateTime);
        setFechaHasta(formattedDateTime);
    }, []); // Ejecutar solo una vez al montar el componente

    const formatTwoDigits = (value) => (value < 10 ? `0${value}` : value);


    // Función para manejar el clic en una opción del menú
    const handleMenuItemClick = (panelName) => {
        setActivePanel(panelName);
        // Si seleccionas 'CREAR USUARIO', establece el usuario seleccionado en un objeto vacío
    };


    async function obtenerDispositivos() {
        const response = await getDeviceImei(cliente, tokenO);
        setDispositivos(response.data);
    }

    const obtenerDispositivoSeleccionado = async (device) => {

        try {
            // Realiza la solicitud para obtener el dispositivo
            const response = await fetch(`${url}/api/devices?uniqueId=${device.uniqueId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            // Verifica si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error(`Error al obtener el dispositivo: ${response.statusText}`);
            }
            // Parsea la respuesta a JSON
            const data = await response.json();
            // Actualiza el dispositivo seleccionado
            setDispositivoSeleccionado(data[0]);

        } catch (error) {
            console.error(error);
        }
    }


    const obtenerFechaDesde = (event) => {
        setFechaDesde(event.target.value);
    }

    const obtenerFechaHasta = (event) => {
        setFechaHasta(event.target.value);
    }

    const mostrarRuta = async () => {
        setRuta([]);
        setPosicionSeleccionada([]);
        const fechaDesdeConTimeZone = moment.utc(fechaDesde).add(5, 'hours').format('YYYY-MM-DDTHH:mm:ss');
        const fechaHastaConTimeZone = moment.utc(fechaHasta).add(5, 'hours').format('YYYY-MM-DDTHH:mm:ss');

        try {
            const response = await fetch(`https://tracker.com.ec/api/reports/route?deviceId=${dispositivoSeleccionado.id}&from=${fechaDesdeConTimeZone}Z&to=${fechaHastaConTimeZone}Z`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }

            const datos = await response.json();
           // console.log(datos);
            setRuta(datos);
            setPosicionSeleccionada(datos[0]);
         
        } catch (error) {
            console.error('Error de la solicitud:', error);
        }

    }



    const mostrarEventos = async () => {
        const fechaDesdeConTimeZone = moment.utc(fechaDesde).add(5, 'hours').format('YYYY-MM-DDTHH:mm:ss');
        const fechaHastaConTimeZone = moment.utc(fechaHasta).add(5, 'hours').format('YYYY-MM-DDTHH:mm:ss');

        try {
            const response = await fetch(`https://tracker.com.ec/api/reports/events?deviceId=${dispositivoSeleccionado.id}&from=${fechaDesdeConTimeZone}Z&to=${fechaHastaConTimeZone}Z`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }

            const datos = await response.json();
            console.log(datos);
            setEventos(datos);
        } catch (error) {
            console.error('Error de la solicitud:', error);
        }

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
                                <Link to={"/pruebasPage"} state={{ email: use, password: pass, tokenO: tokenO, token: token, admin:admin}} className="nav-link">PRUEBAS</Link>
                            </li>
                        </ul>

                        <Link to={"/pruebasLogin"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
                    </div>
                </div>
            </nav>
            <div style={{ display: 'flex', flex: 1 }}>
                <div className="left-menu" style={{ flex: '0 0 20%', backgroundColor: 'lightgray' }}>
                    {/* Menú de opciones en la parte izquierda */}
                    <List>
                        <ListItem button onClick={() => handleMenuItemClick('rutas')}>
                            <ListItemText primary="RUTAS" />
                        </ListItem>
                        <ListItem button onClick={() => handleMenuItemClick('eventos')}>
                            <ListItemText primary="EVENTOS" />
                        </ListItem>
                    </List>
                </div>
                <div className="content-panel" style={{ flex: '1', padding: '20px' }}>
                    {activePanel === 'rutas' && (
                        <Container >
                            {ruta && ruta.length > 0  && posicionSeleccionada && <MapRoute posiciones={ruta} posicionSelected={posicionSeleccionada} />}
                            <Col>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente"
                                        style={{ height: '30px', marginRight: '10px' }} // Ajusta la altura aquí
                                        onChange={(e) => setCliente(e.target.value)}
                                    />
                                    <IconButton size="small" title="Informacion" style={{ height: '30px' }} onClick={obtenerDispositivos}>
                                        BUSCAR
                                    </IconButton>

                                </div>
                              
                            </Col>
                            <Paper elevation={3} style={{ maxHeight: '75px', overflow: 'auto', marginTop: '4px' }}>
                                <List>
                                    {dispositivos.map(device => (
                                        <div key={device.id} style={{ display: 'flex', alignItems: 'center' }}>
                                            <ListItemButton onClick={() => obtenerDispositivoSeleccionado(device)}>
                                                <ListItemText primary={device.name} secondary={`${device.uniqueId} - ${device.chasis}`} />
                                            </ListItemButton>
                                        </div>
                                    ))}
                                </List>
                            </Paper>
                            <Row style={{ marginTop: '20px' }}>
                                <Col>
                                    <TextField
                                        label="Fecha Desde"
                                        type="datetime-local"
                                        value={fechaDesde}
                                        onChange={obtenerFechaDesde}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Col>
                                <Col>
                                    <TextField
                                        label="Fecha Hasta"
                                        type="datetime-local"
                                        value={fechaHasta}
                                        onChange={obtenerFechaHasta}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Col>
                                <Col>
                                    <Button variant="warning" onClick={mostrarRuta}>
                                        MOSTRAR REPORTE
                                    </Button>
                                </Col>
                             
                            </Row>                      
                            <TableContainer component={Paper} style={{ maxHeight: '100vh', overflow: 'auto', marginTop: '15px' }}>
                                <Row style={{ alignItems: 'center' }}>
                                    <Typography variant="h4" style={{ textAlign: 'center' }}>
                                        {dispositivoSeleccionado.name}
                                    </Typography>
                                </Row>                                                                                    
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>HORA</TableCell>
                                            <TableCell>VELOCIDAD</TableCell>
                                            <TableCell>LATITUD</TableCell>
                                            <TableCell>LONGITUD</TableCell>
                                            <TableCell>DIRECCION</TableCell>
                                            <TableCell>EVENTO</TableCell>
                                            <TableCell>ENCENDIDO</TableCell>
                                            <TableCell>BLOQUEADO</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {ruta.map((fila, index) => (
                                    <TableRow>
                                    <TableCell style={{ width: '1%',
                                        paddingLeft: 1}} padding="none">
                                            {posicionSeleccionada === fila ? (
                                            <IconButton size="small" onClick={() => handleBotonClick(null)}>
                                                <GpsFixedIcon fontSize="small" />
                                            </IconButton>
                                            ) : (
                                            <IconButton size="small" onClick={() => handleBotonClick(fila)}>
                                                <LocationSearchingIcon fontSize="small" />
                                            </IconButton>
                                            )}
                                        </TableCell>
                                                <TableCell>{moment(fila.deviceTime).format('YYYY-MM-DD | HH:mm:ss')}</TableCell>
                                                <TableCell>{Math.round(fila.speed * 1.852)} km/h</TableCell>
                                                <TableCell>{fila.latitude}</TableCell>
                                                <TableCell>{fila.longitude}</TableCell>
                                                <TableCell>{fila.address}</TableCell>
                                                <TableCell>{fila.attributes.event}</TableCell>
                                                <TableCell>{fila.attributes.ignition === true ? 'SI' : 'NO'}</TableCell>
                                                <TableCell>{fila.attributes.blocked === true ? 'SI' : 'NO'}</TableCell>
                                                {/* ... */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Container>
                    )}{
                        activePanel === 'eventos' && (
                            <Container>
                                <Col>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Buscar cliente"
                                            style={{ height: '30px', marginRight: '10px' }} // Ajusta la altura aquí
                                            onChange={(e) => setCliente(e.target.value)}
                                        />
                                        <IconButton size="small" title="Informacion" style={{ height: '30px' }} onClick={obtenerDispositivos}>
                                            BUSCAR
                                        </IconButton>
    
                                    </div>
                                  
                                </Col>
                            
                                <Paper elevation={3} style={{ maxHeight: '150px', overflow: 'auto', marginTop: '4px' }}>
                                    <List>
                                        {dispositivos.map(device => (
                                            <div key={device.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemButton onClick={() => obtenerDispositivoSeleccionado(device)}>
                                                    <ListItemText primary={device.name} secondary={`${device.uniqueId} - ${device.chasis}`} />
                                                </ListItemButton>
                                            </div>
                                        ))}
                                    </List>
                                </Paper>
                                <Row style={{ marginTop: '20px' }}>
                                    <Col>
                                        <TextField
                                            label="Fecha Desde"
                                            type="datetime-local"
                                            value={fechaDesde}
                                            onChange={obtenerFechaDesde}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Col>
                                    <Col>
                                        <TextField
                                            label="Fecha Hasta"
                                            type="datetime-local"
                                            value={fechaHasta}
                                            onChange={obtenerFechaHasta}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Col>
                                    <Col>
                                        <Button variant="warning" onClick={mostrarEventos}>
                                            MOSTRAR REPORTE
                                        </Button>
                                    </Col>
                                </Row>
                                <TableContainer component={Paper} style={{ maxHeight: '100vh', overflow: 'auto', marginTop: '15px' }}>
                                    <Row style={{ alignItems: 'center' }}>
                                        <Typography variant="h4" style={{ textAlign: 'center' }}>
                                            {dispositivoSeleccionado.name}
                                        </Typography>
                                    </Row>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>HORA</TableCell>
                                                <TableCell>TIPO</TableCell>
                                                <TableCell>DATOS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {eventos.map((fila, index) => (
                                                <TableRow key={index}>
                                                    {/* Agrega aquí las celdas de datos según la estructura de tu objeto */}
                                                    <TableCell>{moment(fila.eventTime).format('YYYY-MM-DD | HH:mm:ss')}</TableCell>
                                                    <TableCell>{fila.type}</TableCell>
                                                    <TableCell>{fila.attributes.alarm}</TableCell>
                                                    {/* ... */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Container>
                        )}{

                    }
                </div>
            </div>
        </div>
    );
};

export default Reportpanel;
