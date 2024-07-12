import React, { useEffect, useState } from 'react';
import LOGO from '../assets/images/LOGO.png';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import alarm from './../assets/music/alert.mp3';
import alarm1 from './../assets/music/audio2.mp3';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import {
  Accordion, AccordionDetails, AccordionSummary, ListItem, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography, Paper, Snackbar, Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionIcon from '@mui/icons-material/Directions';
import InfoIcon from '@mui/icons-material/Info';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Event from '@mui/icons-material/EventAvailable';
import Add from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import KeyIcon from '@mui/icons-material/Key';
// import { eventsActions } from './eventsActions';
import { formatTime } from '../helpers/formato';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Button, Form } from 'react-bootstrap-v5';
import { getBitacoras, getMantenimientos, getNovedades, getUserID, postBitacora, postNovedad } from '../services/apiRest';
import { authLogin } from '../services/apiRest';


export default function Eventos() {
  const position = {
    attributes: {

    }
  }
  const url = 'https://tracker.com.ec';
  const [eventList, setEventList] = useState([]);
  const [devices, setDevices] = useState([]);
  const location = useLocation();
  // const token = new URLSearchParams(window.location.search).get('token');

  const user = "monitoreo";
  const clave = "WtV2R2^9L-z=";
  const token = location.state.token;
  const [, setSearchValue] = useState(' ');
  const [dispositivoBuscado, setDispositivoBuscado] = useState(devices);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);
  const [show6, setShow6] = useState(false);
  const [show7, setShow7] = useState(false);
  const [open, setOpen] = useState(false);
  const [opensnackbitacora, setOpenSnackBitacora] = useState(false);
  const [token1, setToken1] = useState('');
  const [selectedData, setSelectedData] = useState({});
  const [info, setInfo] = useState(position);
  const [novedades, setNovedades] = useState([]);
  const [textoIngresado, setTextoIgresado] = useState('');
  const [novedadIngresada, setNovedadIngresada] = useState('');
  const [deviceSeleccionado, setDeviceSeleccionado] = useState('');
  const [bitacoras, setBitacoras] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [observacion, setObservacion] = useState('');
  const [placa, setPlaca] = useState('');
  const [usuarioB, setUsuarioB] = useState({});


  var link = '';

  useEffect(() => {

    obtenerDispositivos();
    obtenerNovedades();
    obtenerToken1();

    const socket = new WebSocket(`wss://tracker.com.ec/api/socket`);
    socket.onopen = () => {
      console.log("CONECTADO AL WEBSOCKET");
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.events) {
        data.events.forEach((event) => {
          addEvent(event);
          console.log(event);

        });
      }
    };

    socket.onerror = (error) => {
      console.error('Error en la conexión del socket:', error);
    };

    
    socket.onclose = () => {
      console.log('Socket closed');
      setShow6(true);

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerToken1 = async () => {
    const values = {
      name: user,
      password: clave
    }
    const dataAuth = await authLogin(values);
    console.log(dataAuth);
    setToken1(dataAuth.data.accessToken);
  }

  const addEvent = (newEvent) => {
    setEventList((prevList) => {
      const count = prevList.reduce((count, event) => {
        if (event.deviceId === newEvent.deviceId) {
          return count + 1;
        }
        return count;
      }, 0);
      if (count < 2) {
        newEvent.attributes.alarm === 'sos' ? new Audio(alarm1).play() : new Audio(alarm).play();
        return [newEvent, ...prevList];
      } else {
        return prevList; 
      }
    });
  };


  const rows = eventList.map((event) => ({
    id: event.id,
    deviceId: event.deviceId,
    deviceName: devices.find(device => device.id === event.deviceId)?.name,
    alarm: event.attributes.alarm,
    eventTime: formatTime(event.eventTime),
    positionId: event.positionId
  }));

  const groupByDeviceName = (data) => {
    const groups = {};
    data.forEach((item) => {
      if (!groups[item.deviceName]) {
        groups[item.deviceName] = {
          id: item.deviceName,
          imei: item.deviceId,
          deviceName: item.deviceName,
          children: [],
        };
      }
      const currentGroup = groups[item.deviceName];
      currentGroup.children.push(item);
    })
    return Object.values(groups);
  };

  const groupedRows = groupByDeviceName(rows);

  const obtenerNovedades = async () => {
    const response = await getNovedades();
    //console.log(response.data);
    setNovedades(response.data);
  }

  const obtenerDispositivos = async () => {
    await fetch(`${url}/api/devices`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => response.json()).then(data => {
      // console.log(data);
      setDevices(data);
    }).catch(error => {
      console.log(error);
    })
  }
  // console.log(rows);


  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = devices.filter(device => device.name.toLowerCase().includes(value.toLowerCase()));
    setDispositivoBuscado(filtered)

  }

  //SACAR POSICION DATA

  const obtenerInfo = async (id) => {
    await fetch(`${url}/api/positions?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => response.json()).then(data => {
      setInfo(data[0]);
      //console.log(info.attributes.blocked);
      link = `https://www.google.com/maps/search/?api=1&query=${data[0].latitude}%2C${data[0].longitude}`;
    }).catch(error => {
      console.log(error);
    })

  }

  // GOOGLE MAPS

  const googleClick = async (id) => {
    await obtenerInfo(id);
    window.open(link, '_blank');
  }

  // FUNCIONES PARA EVENTOS
  const deleteEvent = (eventToDelete) => {
    setEventList((prevList) =>
      prevList.filter((event) => event.id !== eventToDelete.id)
    );
  };

  const deleteAllEventsFromDevice = (deviceIds) => {
    setEventList((prevList) =>
      prevList.filter((event) => !deviceIds.includes(event.id))
    );
  };

  const deleteAllEvents = () => {
    setEventList([]);
  };


  //GRAFICAR EVENTOS    
  const renderGroupedRows = (groupedRows) => (
    groupedRows.map((group) => (
      <Accordion key={group.id} style={{
        background: group.children[0].alarm === 'powerCut' ? '#C0E5F5' :
          group.children[0].alarm === 'sos' ? '#FB7676' : 'green'

      }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" style={{
          }} >{group.deviceName}</Typography>
          <IconButton size="small" onClick={() => (deleteAllEventsFromDevice(group.children.map((child) => child.id)))}>
            <DeleteIcon fontSize="small" style={{ color: 'black' }} />
          </IconButton>
          <IconButton size="small" title='HISTORIAL DE BITACORAS' onClick={() => ((handleShow4(group.children[0].deviceId)))}>
            <AssignmentIcon fontSize="small" style={{ color: 'black' }} />
          </IconButton>
          <IconButton size="small" title='PALABRA CLAVE' onClick={() => ((handleShow5(group.children[0].deviceId, group.deviceName, 1)))}>
            <KeyIcon fontSize="small" style={{ color: 'black' }} />
          </IconButton>
          <IconButton size="small" title='MANTENIMIENTOS' onClick={() => handleShow7(group.children[0].deviceId)}>
            <BuildCircleIcon fontSize="small" style={{ color: 'black' }} />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {group.children.map((row) => (
              <ListItem key={row.id} >
                <ListItemButton
                  key={row.id}
                  disabled={!row.id}
                  target='_blank'
                  onClick={() => (googleClick(row.positionId))}

                >
                  <ListItemText primary={` ${row.alarm === 'powerCut' ? 'CORTE DE CORRIENTE' : 'SOS'}  •  ${devices.find(device => device.id === row.deviceId)?.placa} •  ${devices.find(device => device.id === row.deviceId)?.contact} •  ${devices.find(device => device.id === row.deviceId)?.model}`} secondary={`${row.eventTime}`}
                  />
                </ListItemButton>
                <IconButton size="small" title='Agregar Bitacora' onClick={() => (handleShow2(row.deviceId))}>
                  <Event fontSize="small" />
                </IconButton>
                <IconButton size="small" title='Abrir Google Maps'>
                  <DirectionIcon fontSize="small" onClick={() => (googleClick(row.positionId))} />
                </IconButton>
                <IconButton size="small" title='Informacion'>
                  <InfoIcon fontSize="small" onClick={() => (handleShow1(row.positionId))} />
                </IconButton>
                <IconButton size="small" title='Detalles'>
                  <HelpIcon fontSize="small" onClick={() => (handleShow(devices.find(device => device.id === row.deviceId)))} />
                </IconButton>
                <IconButton size="small" onClick={() => (deleteEvent(row))} title='Borrar'>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    ))
  );

  //GRAFICAR INFORMACION DEL DISPOSITIVO

  const handleShow = (device) => {
    setSelectedData(device);
    handleShow5(device.id, device.name, 2);
    console.log(device);
    setObservacion(device.model);
    setPlaca(device.placa);
    setShow(true);
  };
  const handleShow1 = (id) => {
    obtenerInfo(id);
    setShow1(true);
  };
  const handleShow2 = (id) => {
    setDeviceSeleccionado(id);
    setShow2(true);
  };
  const handleShow3 = (id) => {
    setShow3(true);
  };
  const handleShow4 = (id) => {
    console.log(id);
    obtenerBitacoras(id);
    setShow4(true);
  };

  const handleShow7 = (id) => {
    obtenerMantenimientos(id);
    setShow7(true);
  };
  const handleShow5 = async (id, name, opc) => {
    try {
      const response = await getUserID(id, token1);
      console.log(response.data);
      if (response.status === 200) {
        if (response.data.length === 0) {
          setUsuarioB([]);
    
        } else {
          for (let i = 0; i < response.data.length; i++) {
            await fetch(`${url}/api/users/${response.data[i].userid}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              },
            }).then(response => response.json()).then(data => {
              let variable = false;
              let primeraPalabra = name.split(' ');
              for (let i = 0; i < primeraPalabra.length; i++) {
                console.log(primeraPalabra[i]);
                if (data.name.includes(primeraPalabra[i])) {
                  variable = true;
                } else {
                  console.log("NO HAY");
                }
                console.log(variable);
              }
              if (variable === true && opc === 2) {
                setUsuarioB(data);
                console.log(opc);
              }
              if (variable === true && opc === 1) {
                setUsuarioB(data);
                console.log(opc);
                setShow5(true);
              }
              if (variable === false && opc === 2) {
                console.log("AFUERAA");
                setUsuarioB([]);
                //setShow5(true);
              } 
              if (variable === false && opc === 1) {
                console.log("AFUERAA");
                setUsuarioB([]);
                setShow5(true);
              } 
              
            }).catch(error => {
              console.log(error);
            })

          }
        }
      }
    } catch (error) {
    }
  };


  const handleClose = () => {
    setShow(false);
    setShow1(false);
    setShow2(false);
    setShow4(false);
    setShow5(false);
    setShow6(false);
    setShow7(false);
  };
  const handleClose1 = () => {
    setShow3(false);
  };


  //BITACORA TEXTO
  const handleSelectedChange = (event) => {
    setTextoIgresado(event.target.value);
  }

  const handleInputChange = async (event) => {
    setTextoIgresado(event.target.value);
    //console.log(textoIngresado)
  }

  const handleInput1Change = async (event) => {
    setObservacion(event.target.value);
    setSelectedData({ ...selectedData, model: event.target.value });
    // console.log(contact);
  };

  const handleInput2Change = async (event) => {
    setPlaca(event.target.value);
    setSelectedData({ ...selectedData, placa: event.target.value });
    // console.log(contact);
  };


  const handleNovedadChange = async (event) => {
    setNovedadIngresada(event.target.value);
    //console.log(textoIngresado)
  }

  // POST GET BITACORAS NOVEDADES

  const insertarNovedad = async (novedad) => {
    const response = await postNovedad(novedad);
    if (response.status === 200) {
      console.log(novedad + 'INGRESADA');
      setNovedadIngresada('');
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
      setShow3(false);
      obtenerNovedades();
    } else {
      console.log( 'ERROR EN EL INGRESO');
    }
  }

  const insertarBitacora = async (deviceId, mensaje) => {
    const bitacora = {
      deviceId: deviceId,
      fecha: moment(new Date()).locale('en').format(),
      mensaje: mensaje
    }
    setOpenSnackBitacora(true);
    setTimeout(() => {
      setOpenSnackBitacora(false);
    }, 5000);
    const response = await postBitacora(bitacora);
    // console.log(bitacora);
    if (response.status === 200) {
      setOpenSnackBitacora(false);
      const name = devices.find(device => device.id === deviceId)?.name;
      groupedRows.map((group) => (group.id === name ? deleteAllEventsFromDevice(group.children.map((child) => child.id)) : null));
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
      setShow2(false);
      setTextoIgresado('');
    }
  }

  const obtenerBitacoras = async (id) => {
    try {
      const response = await getBitacoras(id);
      // console.log(response.data);
      if (response.status === 200) {
        setBitacoras(response.data);
        console.log(response.data);
      }
    } catch (error) {
      setBitacoras([]);
      //console.log(bitacoras);
    }
  }

  const obtenerMantenimientos = async (id) => {
    try {
      const response = await getMantenimientos(id, token1);
      // console.log(response.data);
      if (response.status === 200) {
        setMantenimientos(response.data);
        console.log(response.data);
      }
    } catch (error) {
      setMantenimientos([]);
      //console.log(bitacoras);
    }
  }

  const handleEdit = async () => {
    console.log(selectedData)
    try {
      const response = await fetch(`${url}/api/devices/${selectedData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedData)
      });
      if (response.status === 200) {
        await obtenerDispositivos();
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
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
            <Link to={"/login1"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
          </div>
        </div>
      </nav>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 30%', marginRight: '20px' }}>
          <div className='container'>
            <div className='row'>
              <div className="col-md-16">
                <input type="text" placeholder="Buscar cliente.." className="search h-50" onChange={e => handleSearch(e.target.value)}></input>
                <FaSearch />
              </div>
              <Paper style={{ maxHeight: 600, overflow: 'auto' }}>
                <List>
                  {dispositivoBuscado.map(device => (
                    <div key={device.id} style={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemButton onClick={() => handleShow(device)}>

                        <ListItemText primary={device.name} />
                      </ListItemButton>
                      <IconButton size="small" title='Informacion' onClick={() => handleShow4(device.id)}>
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title='MANTENIMIENTOS' onClick={() => handleShow7(device.id)}>
                        <BuildCircleIcon fontSize="small" style={{ color: 'black' }} />
                      </IconButton>
                    </div>
                  ))}
                </List>
              </Paper>
            </div>
          </div>
        </div>
        <div style={{ flex: '1', borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
          <ul>
            <Toolbar disableGutters>
              <Typography variant="h6">
              </Typography>
              <h3>EVENTOS</h3>
              <IconButton size="small" color="inherit" onClick={() => (deleteAllEvents())}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Toolbar>
            <div>
              {renderGroupedRows(groupedRows)}
            </div>
          </ul>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size='lg' aria-labelledby='contained-modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            DATOS DEL DISPOSITIVO
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">NOMBRE:</label> <label className="form-label"> {selectedData.name}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">CHIP:</label> <label className="form-label"> {selectedData.phone}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">CADUCIDAD:</label> <label className="form-label"> {moment(selectedData.fechafincontrato).format(moment.HTML5_FMT.DATE)}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">CONTACTO:</label> <label className="form-label"> {selectedData.contact}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">OBSERVACIONES:</label>
                <input
                  className="form-control"
                  type="text"
                  value={observacion}
                  onChange={handleInput1Change}
                />
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">PLACA:</label> <input
                  className="form-control"
                  type="text"
                  value={placa}
                  onChange={handleInput2Change}
                />
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">CHASIS:</label> <label className="form-label"> {selectedData.chasis}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">MODELO:</label> <label className="form-label"> {selectedData.motor}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">DIRECCION:</label> <label className="form-label"> {usuarioB.direccion}</label>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='warning' onClick={() => (handleEdit(observacion))}>
            ACTUALIZAR DATOS
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show1} onHide={handleClose} size='xs' aria-labelledby='contained-modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            {devices.find(device => device.id === info.deviceId)?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">ENCENDIDO:</label> <label className="form-label"> {info.attributes.ignition ? 'SI' : ' NO'}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">BLOQUEADO:</label> <label className="form-label"> {info.attributes.blocked ? 'SI' : 'NO'}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">PROTOCOLO:</label> <label className="form-label"> {info.protocol}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">VELOCIDAD:</label> <label className="form-label"> {info.speed} km/h</label>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose} size='xs' aria-labelledby='contained-modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            BITACORA
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Form.Group className='mb-3' controlId='example'>
                <Container style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Select aria-label='Default select example' onChange={handleSelectedChange}>
                    {novedades.map(novedad => (
                      <option>{novedad.novedad}</option>
                    ))}
                  </Form.Select>
                  <IconButton onClick={() => (handleShow3())}>
                    <Add />
                  </IconButton>
                </Container>
              </Form.Group>
              <Form.Group className='mb-3' controlId='example'>
                <Form.Label>
                  Ingrese la novedad
                </Form.Label>
                <Form.Control as="textarea" onChange={handleInputChange} value={textoIngresado}>
                </Form.Control>
              </Form.Group>
              <Button onClick={() => (insertarBitacora(deviceSeleccionado, textoIngresado))}>
                GUARDAR
              </Button>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal show={show3} onHide={handleClose1} size='xs' aria-labelledby='contained
      -modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            AGREGAR NUEVA NOVEDAD
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Form.Group className='mb-3' controlId='example'>
                <Form.Label>
                  Ingrese la novedad
                </Form.Label>
                <Form.Control as="textarea" onChange={handleNovedadChange} value={novedadIngresada}>
                </Form.Control>
              </Form.Group>
              <Container style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant='warning' onClick={() => (insertarNovedad(novedadIngresada))}>
                  GUARDAR
                </Button>
              </Container>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal show={show4} onHide={handleClose} size='lg' aria-labelledby='contained-modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            HISTORIAL BITACORAS
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Paper style={{ maxHeight: 200, overflow: 'auto', paddingLeft: '12px' }}>
            <List>
              {bitacoras.map(bitacora => (
                <ListItemText>
                  <Grid container spacing={2}>
                    <Grid item xs={3} sx={{ borderRight: '2px solid #ccc' }}>
                      <Typography>
                        <strong>{moment.utc(bitacora.fecha).format('YYYY-MM-DD | HH:mm')}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {bitacora.mensaje}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItemText>
              ))}
            </List>
          </Paper>
        </Modal.Body>
      </Modal><Modal show={show5} onHide={handleClose} size='xs' aria-labelledby='contained-modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            {usuarioB.length !== 0 ? usuarioB.name : 'NO HAY USUARIO'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">PALABRA CLAVE:</label> <label className="form-label">{usuarioB.phone == null || usuarioB.phone === '' ? 'NO TIENE PALABRA CLAVE' : usuarioB.phone}</label>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal show={show7} onHide={handleClose} size='lg' aria-labelledby='contained-modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            HISTORIAL MANTENIMIENTOS AGENDADOS
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Paper style={{ maxHeight: 200, overflow: 'auto', paddingLeft: '12px' }}>
            <List>
              {mantenimientos.map(mantenimiento => (
                <ListItemText>
                  <Grid container spacing={2}>
                    <Grid item xs={3} sx={{ borderRight: '2px solid #ccc' }}>
                      <Typography>
                        <strong>{moment.utc(mantenimiento.fecha).format('YYYY-MM-DD | HH:mm')}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {mantenimiento.observacion}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItemText>
              ))}
            </List>
          </Paper>
        </Modal.Body>
      </Modal>
      <Modal show={show6} onHide={handleClose} size='xs' aria-labelledby='contained-modal-tittle-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            CONEXIÓN PERDIDA, RECARGAR PÁGINA
          </Modal.Title>
        </Modal.Header>
      </Modal>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        message="INGRESO EXITOSO"
      />
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Snackbar
        open={opensnackbitacora}
        autoHideDuration={3000}
        message="INGRESANDO BITACORA ESPERE...."
        ContentProps={{
          sx: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      />
    </div>
    </>
  )
}
