import React, { useState } from 'react';
import LOGO from '../assets/images/LOGO.png';
import { Link } from 'react-router-dom';
import { Container, IconButton, List, ListItemButton, ListItemText, Paper, TextField, Typography, Snackbar, Alert } from '@mui/material';
import Map from '../Map/Map';
import { useLocation } from 'react-router-dom';
import { getDeviceImei } from '../services/apiRest';
import moment from 'moment';
import { Button, Col, Row } from 'react-bootstrap-v5';
import FloatingPanel from './detalles';
import StatusCard from './statusCard';


export default function PruebasPage() {

  const location = useLocation();
  const [imei, setImei] = useState("");
  const tokenO = location.state.tokenO;
  const token = location.state.token;
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState({});
  const [grupos, setGrupos] = useState([]);
  const [open, setOpen] = useState(false);
  const url = 'https://tracker.com.ec';
  const [currentPosition, setCurrentPosition] = useState([-78.765061, -1.718326]);
  const [position, setPosition] = useState(null);
  const [evento, setEvento] = useState(null);
  const [socket, setSocket] = useState(null);
  const [item, setItem] = useState();
  const [estado, setEstado] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  /*const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };*/


  const conectarWebSocket = async (dispositivoSeleccionado) => {


    //console.log(dispositivoSeleccionado.id);
    const newSocket = new WebSocket(`wss://tracker.com.ec/api/socket`);
    newSocket.onopen = () => {
      console.log("CONECTADO AL WEBSOCKET");
    }

    newSocket.onclose = () => {
      console.log('Socket closed');
    };

    newSocket.onmessage = (event) => {
      // const data = JSON.parse(event.data);
      const data = JSON.parse(event.data);
      if (data.devices) {
        data.devices.forEach((device) => {
          //console.log(dispositivoSeleccionado);
          if (device.id === dispositivoSeleccionado.id) {
            console.log(device);
            setEstado(device.status);
          }
        });
      }
      if (data.positions) {
        data.positions.forEach((posicion) => {
          if (posicion.deviceId === dispositivoSeleccionado.id) {
            //console.log(posicion);
            setCurrentPosition([posicion.longitude, posicion.latitude]);
            setPosition(posicion); // Esperar a que se establezca la posición
            setItem({
              deviceId: posicion.deviceId,
              totalDistance: posicion.attributes.totalDistance
            });
          }
        });

      }
      if (data.events) {
        data.events.forEach((event) => {
          //console.log(dispositivoSeleccionado);
          if (event.deviceId === dispositivoSeleccionado.id) {
            console.log(event);
            setEvento(event);
            setOpenSnackbar(true);
            setTimeout(() => {
              setOpenSnackbar(false);
            }, 6000);
          }
        });
      }


    };

    newSocket.onerror = (error) => {
      console.error('Error en la conexión del socket:', error);
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    // Actualizar el estado del socket con el nuevo socket
    setSocket(newSocket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  async function obtenerDispositivos() {
    const response = await getDeviceImei(imei, tokenO);
    setDispositivos(response.data);

  }

  const insertarKilometraje = async () => {
    console.log(item);
    const response = await fetch(`${url}/api/devices/${item.deviceId}/accumulators`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(item),
    });
    console.log(response);
  }

  const distanceFromMeters = (value) => value / 1000;

  const distanceToMeters = (value) => value * 1000;

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
      setEstado(data[0].status);
      setDispositivoSeleccionado(data[0]);
      // Llama a obtenerGrupos
      obtenerGrupos();
      // Llama a conectarWebSocket después de establecer el dispositivo seleccionado
      conectarWebSocket(data[0]);


    } catch (error) {
      console.error(error);
    }
  }

  const obtenerGrupos = async () => {
    await fetch(`${url}/api/groups`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => response.json()).then(data => {
      setGrupos(data);
      //console.log(data);
    }).catch(error => {
      console.log(error);
    })
  }

  const handleEdit = async () => {
    //console.log(dispositivoSeleccionado)
    try {
      const response = await fetch(`${url}/api/devices/${dispositivoSeleccionado.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dispositivoSeleccionado)
      });
      // console.log(response);
      if (response.status === 200) {
        insertarKilometraje();
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{  display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
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
            </ul>
            <Link to={"/pruebasLogin"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
          </div>
        </div>
      </nav>
      <Container maxWidth="100%" style={{height: '80%'}}>
        <Row>
          <Col sm={6} style={{ marginTop: '10px' }}>
            <Col>
              <input type="text" placeholder="Buscar cliente" className="search h-50" onChange={e => setImei(e.target.value)} />
              <IconButton size="small" title='Informacion' onClick={obtenerDispositivos}>
                BUSCAR
              </IconButton>
            </Col>
            <Paper elevation={3} style={{ maxHeight: '60px', overflow: 'auto', marginTop: '2px' }}>
              <List>
                {dispositivos.map(device => (
                  <div key={device.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemButton onClick={() => obtenerDispositivoSeleccionado(device)}>
                      <ListItemText primary={device.name} secondary={device.uniqueId - device.chasis} />
                    </ListItemButton>
                  </div>
                ))}
              </List>
            </Paper>
            <Container style={{ border: '2px solid #000', overflow: 'auto', marginTop: '5px' , height: '62%' }} >
              <div>
                <Container style={{ overflow: 'auto', marginTop: '10px' }}>
                  <Typography variant="h6" gutterBottom>
                    DATOS DEL DISPOSITIVO
                  </Typography>
                  {dispositivoSeleccionado && (
                    <>
                      <TextField
                        value={dispositivoSeleccionado.name || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, name: event.target.value })}
                        label='Nombre'
                        style={{
                          width: '48%',
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.uniqueId || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, uniqueid: event.target.value })}
                        label='Imei'
                        style={{
                          width: '48%',
                          marginLeft: '20px',
                          marginBottom: '10px'
                        }}
                      />
                      <select style={{ width: '100%' }} value={dispositivoSeleccionado.groupId} onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, groupId: event.target.value })}>
                        <option value="">Selecciona un grupo</option>
                        {grupos.map((grupo) => (
                          <option key={grupo.id} value={grupo.id}>
                            {grupo.name}
                          </option>
                        ))}
                      </select>
                      <TextField
                        value={dispositivoSeleccionado.phone || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, phone: event.target.value })}
                        label="Nro. Chip"
                        style={{
                          width: '48%',
                          marginTop: '10px'
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.contact || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, contact: event.target.value })}
                        label='Contacto'
                        style={{
                          width: '48%',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.model || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, model: event.target.value })}
                        label="Observaciones"
                        style={{
                          width: '100%',
                          marginTop: '10px',
                        }}
                      />
                      <TextField
                        label="Fecha Inicio"
                        type="date"
                        value={(dispositivoSeleccionado.fechainiciocontrato && moment(dispositivoSeleccionado.fechainiciocontrato).locale('en').format(moment.HTML5_FMT.DATE)) || '2099-01-01'}
                        onChange={(e) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, fechainiciocontrato: moment(e.target.value, moment.HTML5_FMT.DATE).locale('en').format() })}
                        style={{
                          width: '48%',
                          marginTop: '10px',
                        }}
                      />
                      <TextField
                        label="Fecha Vence"
                        type="date"
                        value={(dispositivoSeleccionado.fechafincontrato && moment(dispositivoSeleccionado.fechafincontrato).locale('en').format(moment.HTML5_FMT.DATE)) || '2099-01-01'}
                        onChange={(e) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, fechafincontrato: moment(e.target.value, moment.HTML5_FMT.DATE).locale('en').format() })}
                        style={{
                          width: '48%',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      />
                      <TextField
                        label="Fecha Recarga"
                        type="date"
                        value={(dispositivoSeleccionado.fecharecarga && moment(dispositivoSeleccionado.fecharecarga).locale('en').format(moment.HTML5_FMT.DATE)) || '2099-01-01'}
                        onChange={(e) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, fecharecarga: moment(e.target.value, moment.HTML5_FMT.DATE).locale('en').format() })}
                        style={{
                          width: '48%',
                          marginTop: '10px',

                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.valorrecarga || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, valorrecarga: event.target.value })}
                        label="Valor Recarga"
                        style={{
                          width: '48%',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.aseguradora || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, aseguradora: event.target.value })}
                        label="Asesor Comercial"
                        style={{
                          width: '48%',
                          marginTop: '10px',
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.placa || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, placa: event.target.value })}
                        label="Placa"
                        style={{
                          width: '48%',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.color || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, color: event.target.value })}
                        label="Color"
                        style={{
                          width: '48%',
                          marginTop: '10px',
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.motor || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, motor: event.target.value })}
                        label="Modelo"
                        style={{
                          width: '48%',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      />
                      <TextField
                        value={dispositivoSeleccionado.chasis || ''}
                        onChange={(event) => setDispositivoSeleccionado({ ...dispositivoSeleccionado, chasis: event.target.value })}
                        label="Chasis"
                        style={{
                          width: '48%',
                          marginTop: '10px',
                        }}
                      />
                      {position && (<TextField
                        value={distanceFromMeters(item.totalDistance)}
                        onChange={(event) => setItem({ ...item, totalDistance: distanceToMeters(Number(event.target.value)) })}
                        label="Kilometraje"
                        style={{
                          width: '48%',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      />)}
                      <div style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        '& > *': {
                          flexBasis: '33%',
                        },
                      }}>
                        <Button variant='warning' onClick={() => (handleEdit())}>
                          ACTUALIZAR DATOS
                        </Button>
                      </div>
                    </>
                  )}
                </Container>
              </div>
            </Container>

          </Col>
          <Col sm={6}>
            <Container >
              <Row style={{ position: 'relative'}}>
                <Map currentPosition={currentPosition} />
                {position && estado && (
                  <StatusCard device={dispositivoSeleccionado} token={token} estate={estado}/>
                )}
                {position && estado && (
                  <FloatingPanel position={position} estado={estado} />
                )}
                {position && evento && (
                  <Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{top
                  : '14%', right: '40px'}} >
                  <Alert variant="outlined"  severity="error" sx={{ background:'#ffff'}} >
                    {evento.attributes.alarm === 'sos' ? 'SOS' : 'CORTE DE CORRIENTE'}
                  </Alert>
                </Snackbar>
                )}
              </Row>             
            </Container>
          </Col>
        </Row>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        message="INGRESO EXITOSO"
      />
    </div>

  )
}
