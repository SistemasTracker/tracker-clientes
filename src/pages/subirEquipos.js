/* eslint-disable no-loop-func */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Col, Table } from 'react-bootstrap-v5';
import { Link } from 'react-router-dom';
import CSVReader from 'react-csv-reader';
import LOGO from '../assets/images/LOGO.png';
import axios from 'axios';
import { Container, TextField } from '@mui/material';

export default function SubirEquipos(props) {

    const location = useLocation();
    let [dispositivos, setDispositivos] = useState([]);
    let [dispositivosT, setDispositivosT] = useState([]);
    let [dipositivossubidos, setdisSubidos] = useState([]);
    const [mensajes, setMensajes] = useState([]); // Nuevo estado para los mensajes
    const use = location.state.email;
    const pass = location.state.password;
    const token = location.state.token;
    const [token1, setToken1] = useState(null);
    const tokenO = location.state.tokenO;
    const url = 'https://tracker.com.ec';

    const dispositivo = (nombre, imei, chip, grupo) => {
        return {
            name: nombre,
            uniqueId: imei,
            phone: chip,
            groupId: grupo
        }
    }
    const dispositivoT = (nombre, imei, chip, grupo, model, estado) => {
        return {
            name: nombre,
            uniqueId: imei,
            phone: chip,
            groupId: grupo,
            model: model,
            estado: estado
        }
    }


    const handleFile = (data) => {
        dispositivos = [];
        dispositivosT = [];
        dipositivossubidos = [];
        for (let i = 0; i < data.length; i++) {
            //Si el tamaño de dispositivos a subir es mayor a 2 dispositivos ingresa
            if (data[i].length > 2) {
                const disp = dispositivo(data[i][0], data[i][1], '0'+data[i][2], data[i][3]);
                const dispT = dispositivoT(data[i][0], data[i][1], '0'+data[i][2], data[i][3], data[i][4], 1);
                dispositivos.push(disp);
                dispositivosT.push(dispT);
            }
        }
        setDispositivosT(dispositivosT);
        setDispositivos(dispositivos);
        setdisSubidos(dipositivossubidos);
    }

    const dispositivoSubido = (data, est, val) => {
        data.model = dispositivosT[val].model
        data.estado = est;
        // data.addItem()
        dipositivossubidos.push(data);   
    }

    const obtenerDevice = async (device) => {
        try {
            const response = await axios.get(`${url}/api/devices?uniqueId=${device.uniqueId}`, {
                auth: {
                    username: use,
                    password: pass
                }
            });
             //setDispositivoE(response.data[0]);
             return response.data[0];
        } catch (error) {
            console.log(error);
        }
    }

    const agregarDispositivo = async (devices, devicesT) => {
        try {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            for (let i = 0; i < devices.length; i++) {
                try {
                    const response = await fetch(`${url}/api/devices`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token1}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(devices[i])
                    });

                    setMensajes(prevMensajes => [...prevMensajes, `Estado de respuesta: ${response.status}`]);

                    if (response.status === 200) {
                        const device = await obtenerDevice(devices[i]);
                        let correcto = true;

                        setMensajes(prevMensajes => [...prevMensajes, `${devices[i].deviceId} -> Id del dispositivo`]);

                        const atributo = devicesT[i].model === '1' ? 80 : 42;                        
                        setMensajes(prevMensajes => [...prevMensajes, `Atributo: ${atributo}`]);
                        const res2 = await agregarAtributoCalculado(device.id, atributo);
                        
                        if (atributo === 42) {
                            await agregarAttibuto130(device);
                        }

                        setMensajes(prevMensajes => [...prevMensajes, `Respuesta atributo calculado: ${res2.status}`]);

                        if (res2.status !== 204) {
                            correcto = false;
                            setMensajes(prevMensajes => [...prevMensajes, 'ATRIBUTO NO ASIGNADO']);
                        }

                        if (correcto) {
                            dispositivoSubido(devicesT[i], 3, i);
                            setMensajes(prevMensajes => [...prevMensajes, `Ingreso exitoso de dispositivo ${i+1}`]);
                        }
                    } else {
                        dispositivoSubido(devicesT[i], 2, i);
                        setMensajes(prevMensajes => [...prevMensajes, `Ingreso fallido de dispositivo ${i+1}`]);
                    }
                } catch (error) {
                    setMensajes(prevMensajes => [...prevMensajes, `Error: ${error.message}`]);
                }
                await delay(180000);
            }
        } catch (error) {
            setMensajes(prevMensajes => [...prevMensajes, `Error al ingresar dispositivos: ${error.message}`]);
        }

        setDispositivosT(dipositivossubidos);
    };
    
    const agregarAtributoCalculado = async (deviceid, atributeid) => {
        const device_attribute = {
            deviceId: deviceid,
            attributeId: atributeid
        }
        console.log(device_attribute);
        try {
            const response = await fetch(`${url}/api/permissions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token1}`,
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(device_attribute)})
            console.log(response.status);
            if(response.status === 200){
                console.log('Atributo Asigando para el dispositivo ' + deviceid + ' ATRIBUTO ' + atributeid );
            }
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    const agregarAttibuto130 = async (device) => {
        console.log(device);
        const updatedDevice = {
            ...device,
            attributes: {
              ...device.attributes,
              isFMB130: true
            }
          };
        try {
            const response = await fetch(`${url}/api/devices/${device.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token1}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedDevice)
            });
            // console.log(response);
            if (response.status === 200) {
                console.log("ATRIBUTO 130 AGREGADO");
            }
          } catch (error) {
            console.log(error);
          }
    }

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
                            <li className="nav-item">
                                <Link to={"/pruebasPage"} state={{ email: use, password: pass, tokenO: tokenO, token: token }} className="nav-link">PRUEBAS</Link>
                            </li>
                        </ul>
                        <Link to={"/pruebasLogin"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
                    </div>
                </div>
            </nav>
            <div className='container my-3'>

               <Container>
               <Col>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            variant="filled"
                            value={token1 || ''}
                            onChange={(event) => setToken1(event.target.value)}
                            label="INSERTE EL TOKEN AQUI"
                            style={{
                                width: '50%',
                                marginTop: '10px',
                                marginLeft: '20px',
                            }}
                        />
                        <Button style={{marginLeft: '40px'}}  className='btn btn-warning' onClick={() => agregarDispositivo(dispositivos, dispositivosT)}>SUBIR EQUIPOS</Button>
                    </div>
                </Col>
                    <div style={{ marginTop: '10px' }}>
                        <CSVReader
                            onFileLoaded={handleFile}
                            inputStyle={{ color: 'green' }}
                        />
                        <br></br>
                       
                    </div>
                    <br></br>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Table className='table table-light table-hover table-bordered align-middle table-responsive'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NOMBRE</th>
                                    <th>IMEI</th>
                                    <th>CHIP</th>
                                    <th>GRUPO</th>
                                    <th>MODELO</th>
                                    <th>ESTADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dispositivosT.map((device, index) => (
                                    <tr className='table-light' key={device.uniqueId}>
                                        <td>{index + 1}</td>
                                        <td>{device.name}</td>
                                        <td>{device.uniqueId}</td>
                                        <td>{device.phone}</td>
                                        <td>{device.groupId}</td>
                                        <td>{device.model}</td>
                                        {(device.estado === 1 ? <td >POR SUBIR</td> : device.estado === 2 ? <td className='table-danger'>ERROR AL INSERTAR</td> : <td className='table-success'>INSERTADO CORRECTAMENTE</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <h1>Resultados:</h1>
                    <div>
                    {mensajes.map((mensaje, index) => (
                        <p key={index}>{mensaje}</p>
                    ))}
                    </div>
                </Container>
            </div>
        </>
    );
}
