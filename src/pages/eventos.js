import React, { useEffect, useState }from 'react';
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import Event from '@mui/icons-material/EventAvailable';
import Add from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
// import { eventsActions } from './eventsActions';
import { formatTime } from '../helpers/formato';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Button, Form } from 'react-bootstrap-v5';
import { getBitacoras, getNovedades, postBitacora, postNovedad } from '../services/apiRest';


export default function Eventos() {
    const position = {
      attributes: {

      }
    }
    const url = 'https://tracker.com.ec';
    const [eventList, setEventList] = useState([]);
    const [devices, setDevices] = useState([]);
    const location = useLocation();
    const token = location.state.token;
    const [, setSearchValue] = useState(' ');
    const [dispositivoBuscado, setDispositivoBuscado] = useState(devices);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [open, setOpen] = useState(false);
    const [desabilitarBoton, setDesabilitarBoton] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [info, setInfo] = useState(position);
    const [novedades, setNovedades] = useState([]);
    const [textoIngresado, setTextoIgresado] = useState('');
    const [novedadIngresada, setNovedadIngresada] = useState('');
    const [deviceSeleccionado, setDeviceSeleccionado] = useState('');
    const [bitacoras, setBitacoras] = useState ([]);
    const [contact, setContact] = useState('');
    const [placa, setPlaca] = useState('');
    var link= '';

    useEffect(() =>{

        obtenerDispositivos();
        obtenerNovedades();
        const socket = new WebSocket(`wss://tracker.com.ec/api/socket`);
          socket.onopen = () => {
            console.log("CONECTADO AL WEBSOCKET");
          }
    
          socket.onclose = () => {
            console.log('Socket closed');
          };
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.events) {
                data.events.forEach((event) => {
                    addEvent(event);
                    if(event.attributes.alarm === 'sos'){
                      new Audio(alarm1).play();
                    }
                    else {
                      new Audio(alarm).play();
                    }
                });
                
            }
            
          };

          socket.onerror = (error) => {
            console.error('Error en la conexión del socket:', error);
          };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

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

      const rows = eventList.map((event) => ({
        id: event.id,
        deviceId: event.deviceId,
        deviceName: devices.find(device => device.id === event.deviceId)?.name,
        // eventType: formatType(event),
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
              deviceName: item.deviceName,
              children: [],
            };
          }
          if (groups[item.deviceName].children.length < 2) {
            groups[item.deviceName].children.push(item);
            
          }
        });
        return Object.values(groups);
      };
    
      const groupedRows = groupByDeviceName(rows);
      // console.log(rows);

      const addEvent = (newEvent) => {
        const existingEvent = eventList.find(event => event.id === newEvent.id);
        if (existingEvent) {
          
          return;
        }
        
        setEventList(prevList => [newEvent , ...prevList]);
      };

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

      const googleClick = async (id) =>{
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
              <Typography variant="subtitle1"  style={{
                      }} >{group.deviceName}</Typography>
              <IconButton size="small" onClick={() => (deleteAllEventsFromDevice(group.children.map((child) => child.id)))}>
                <DeleteIcon fontSize="small" style={{ color: 'black' }} />
              </IconButton>
              <IconButton size="small" title='Informacion' onClick={() => ((handleShow4(group.children[0].deviceId)))}>
                  <AssignmentIcon fontSize="small" style={{ color: 'black' }}/>
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
                      <Event fontSize="small"/>
                    </IconButton>
                    <IconButton size="small" title='Abrir Google Maps'>
                      <DirectionIcon fontSize="small" onClick={() => (googleClick(row.positionId))}/>
                    </IconButton>
                    <IconButton size="small" title='Informacion'>
                      <InfoIcon fontSize="small"  onClick={() => (handleShow1(row.positionId))}/>
                    </IconButton>
                    <IconButton size="small" title='Detalles'>
                      <HelpIcon fontSize="small"  onClick={() => (handleShow(devices.find(device => device.id === row.deviceId)))}/>
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
        setContact(device.contact);
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
      const handleShow4 =  (id) => {
        console.log(id);
        obtenerBitacoras(id);
        setShow4(true);
      };
      const handleClose = () => {
        setShow(false);
        setShow1(false);
        setShow2(false);
        setShow4(false);
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
        setContact(event.target.value);
        setSelectedData({...selectedData, contact: event.target.value});
        // console.log(contact);
      };

      const handleInput2Change = async (event) => {
        setPlaca(event.target.value);
        setSelectedData({...selectedData, placa: event.target.value});
        // console.log(contact);
      };


      const handleNovedadChange = async (event) => {
        setNovedadIngresada(event.target.value);
        //console.log(textoIngresado)
      }

      // POST GET BITACORAS NOVEDADES

      const insertarNovedad = async (novedad) => {
      setDesabilitarBoton(true);
      const response = await postNovedad(novedad);
      //console.log(novedad);
      if(response.status === 200){
        setNovedadIngresada('');
        setDesabilitarBoton(false);
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
        setShow3(false);
        obtenerNovedades();
      }
      }

      const insertarBitacora = async (deviceId, mensaje) => {
        const bitacora = {
          deviceId: deviceId,
          fecha : moment(new Date()).locale('en').format(),
          mensaje: mensaje
        }
        setDesabilitarBoton(true);
        const response = await postBitacora(bitacora);
        // console.log(bitacora);
        if(response.status === 200){
          const name = devices.find(device => device.id === deviceId)?.name;
          groupedRows.map((group) => ( group.id === name ? deleteAllEventsFromDevice(group.children.map((child) => child.id)) : null));
          setDesabilitarBoton(false);
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 3000);
          setShow2(false);
          setTextoIgresado('');
        }
      }

      const obtenerBitacoras = async (id) => {
        try {
          const response = await getBitacoras(id);
          // console.log(response.data);
          if(response.status === 200){
            setBitacoras(response.data);
            console.log(bitacoras);
          }
        } catch (error) {
          setBitacoras([]);
          //console.log(bitacoras);
        }
      }

      // EDITAR NUMERO Y PLACA

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
          if(response.status === 200) {
            await obtenerDispositivos();
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
              }, 3000);
            }
        } catch (error) {
          console.log(error);
        }
       /* await fetch(`${url}/api/devices/${selectedData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(selectedData)
        }).then(response => response.json()).then(data => {
          // console.log(data);
          obtenerDispositivos();
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 3000);
        }).catch(error => {
          console.log(error);
        })*/
      };
      


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
          <div className="container-fluid">
            <span className="navbar-brand">
            <img src={LOGO} alt="" width="30" height="24" className="d-inline-block align-text-top"/>
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
      <div style={{display: 'flex'}}>
      <div style={{ flex: '0 0 30%', marginRight: '20px'}}>
          <div className='container'>
              <div className='row'>
                  <div className="col-md-16">                       
                        <input type="text" placeholder="Buscar cliente.." className="search h-50" onChange={e=> handleSearch(e.target.value)}></input>
                        <FaSearch />
                  </div> 
                    <Paper style={{maxHeight: 600, overflow: 'auto'}}>
                    <List>
                      {dispositivoBuscado.map(device => (
                        <div key={device.id} style={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemButton onClick={() => handleShow(device)}>
                          <ListItemText primary={device.name} />
                        </ListItemButton>
                        <IconButton size="small" title='Informacion' onClick={() => handleShow4(device.id)}>
                          <AssignmentIcon fontSize="small" />
                        </IconButton>
                        </div> 
                      ))}
                    </List>
                    </Paper>               
              </div>                 
            </div>
      </div>
      <div style={{ flex: '1', borderLeft: '1px solid #ccc', paddingLeft: '20px'}}>
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
                      <label className="form-label fw-bold">CONTACTO:</label>
                        <input
                          className="form-control"
                          type="text"
                          value={contact}
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
                  </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='warning' onClick={() => (handleEdit(contact))}>
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
                <Container style={{ display: 'flex', alignItems: 'center'}}>
                  <Form.Select aria-label='Default select example' onChange={handleSelectedChange}>
                      {novedades.map(novedad => (
                          <option>{novedad.novedad}</option>
                        ))}                       
                  </Form.Select>
                  <IconButton onClick={() => (handleShow3())}>
                      <Add/>
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
                <Button disabled={desabilitarBoton} onClick={() => (insertarBitacora(deviceSeleccionado, textoIngresado))}>
                  GUARDAR
                </Button>
              </Form>
            </Container>
        </Modal.Body>
    </Modal>
    <Modal show={show3} onHide={handleClose1} size='xs' aria-labelledby='contained-modal-tittle-vcenter' centered>
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
                <Container style={{ display: 'flex', alignItems: 'center'}}>
                <Button disabled={desabilitarBoton} variant='warning' onClick={() => (insertarNovedad(novedadIngresada))}>
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
        <Paper style={{maxHeight: 200, overflow: 'auto', paddingLeft: '12px' }}>
          <List>
            {bitacoras.map(bitacora => (
                <ListItemText>
                 <Grid container spacing={2}>
                  <Grid item xs={3} sx={{ borderRight: '2px solid #ccc' }}>
                    <Typography>
                      <strong>{moment(bitacora.fecha).format('YYYY-MM-DD | HH:mm')}</strong>
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
    </Modal>
    <Snackbar
        open={open}
        autoHideDuration={2000}
        message="INGRESO EXITOSO"
      />
    </>
  )
}
