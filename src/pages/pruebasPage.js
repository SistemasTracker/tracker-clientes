import React, { useEffect, useState } from "react";
import LOGO from "../assets/images/LOGO.png";
import { Link } from "react-router-dom";
import {
  Container,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CardActions,
  Grid,
} from "@mui/material";
import Map from "../Map/Map";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import MapIcon from "@mui/icons-material/Map";
import { useLocation } from "react-router-dom";
import {
  getDeviceImei,
  getMantenimientos,
  postMantenimiento,
} from "../services/apiRest";
import moment from "moment";
import { Button, Col, Form, Modal, Row } from "react-bootstrap-v5";
import FloatingPanel from "./detalles";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import StatusCard from "./statusCard";
import LinkField from "./LinkField";
import InfoIcon from "@mui/icons-material/Info";
import alarm from "./../assets/music/alert2.mp3";

export default function PruebasPage() {
  const location = useLocation();
  const [imei, setImei] = useState("");
  const tokenO = location.state.tokenO;
  const token = location.state.token;
  const admin = location.state.admin;
  const email = location.state.email;
  const password = location.state.password;
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState({});
  const [grupos, setGrupos] = useState([]);
  const [open, setOpen] = useState(false);
  const url = "https://tracker.com.ec";
  const [currentPosition, setCurrentPosition] = useState([
    -78.765061, -1.718326,
  ]);
  const [position, setPosition] = useState(null);
  const [evento, setEvento] = useState(null);
  const [item, setItem] = useState();
  const [estado, setEstado] = useState("");
  //const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [textoIngresado, setTextoIgresado] = useState("");
  const [desabilitarBoton, setDesabilitarBoton] = useState(false);
// EMPIEZA USE EFFECT
  useEffect(() => {
    const newSocket = new WebSocket(`wss://tracker.com.ec/api/socket`);

    newSocket.onopen = () => {
      console.log("CONECTADO AL WEBSOCKET");
    };

    newSocket.onclose = () => {
      console.log("Socket closed");
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.devices) {
        const selectedDeviceData = data.devices.find(
          (device) => device.id === dispositivoSeleccionado.id
        );
        if (selectedDeviceData) {
          console.log(selectedDeviceData);
          setEstado(selectedDeviceData.status);
        }
      }

      if (data.positions) {
        const selectedDevicePosition = data.positions.find(
          (posicion) => posicion.deviceId === dispositivoSeleccionado.id
        );
        if (selectedDevicePosition) {
          console.log(selectedDevicePosition);
          setCurrentPosition([
            selectedDevicePosition.longitude,
            selectedDevicePosition.latitude,
          ]);
          setPosition(selectedDevicePosition);
          setItem({
            deviceId: selectedDevicePosition.deviceId,
            totalDistance: selectedDevicePosition.attributes.totalDistance,
          });
        }
      }

      if (data.events) {
        const selectedDeviceEvent = data.events.find(
          (event) => event.deviceId === dispositivoSeleccionado.id
        );
        if (selectedDeviceEvent) {
          setEvento(selectedDeviceEvent);
          new Audio(alarm).play();
          setOpenSnackbar(true);
          setTimeout(() => {
            setOpenSnackbar(false);
          }, 6000);
        }
      }
    };

    return () => {
      newSocket.close();
    };
  }, [dispositivoSeleccionado]);
// TERMINA

  const obtenerDispositivos = async () => {
    if (!imei.trim()) {
      alert("El campo no puede estar vacío");
      return;
    }
    try {
      const response = await getDeviceImei(imei, tokenO);
      setDispositivos(response.data);
    } catch (error) {
      console.error("Error al obtener dispositivos:", error);
    }
  };

  const handleInputChange = async (event) => {
    setTextoIgresado(event.target.value);
    //console.log(textoIngresado)
  };

  const insertarKilometraje = async () => {
    //console.log(item);
    const response = await fetch(
      `${url}/api/devices/${item.deviceId}/accumulators`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      }
    );
    console.log(response);
  };

  const distanceFromMeters = (value) => value / 1000;

  const distanceToMeters = (value) => value * 1000;

  const obtenerDispositivoSeleccionado = async (device) => {
    setEstado("");
    setDispositivoSeleccionado({});

    try {
      // Realiza la solicitud para obtener el dispositivo
      const response = await fetch(
        `${url}/api/devices?uniqueId=${device.uniqueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener el dispositivo: ${response.statusText}`
        );
      }

      // Parsea la respuesta a JSON
      const data = await response.json();
      // Actualiza el dispositivo seleccionado
      setEstado(data[0].status);
      setDispositivoSeleccionado(data[0]);
      // Llama a obtenerGrupos
      obtenerGrupos();
    } catch (error) {
      console.error(error);
    }
  };

  const [tipoMapa, setTipoMapa] = useState("normal"); // Puedes establecer el valor predeterminado según tus necesidades

  const handleTipoMapaChange = (nuevoTipoMapa) => {
    setTipoMapa(nuevoTipoMapa);
  };

  const obtenerGrupos = async () => {
    await fetch(`${url}/api/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGrupos(data);
        //console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = async () => {
    //console.log(dispositivoSeleccionado)
    try {
      const response = await fetch(
        `${url}/api/devices/${dispositivoSeleccionado.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dispositivoSeleccionado),
        }
      );
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

  const insertarMantenimiento = async (deviceId, mensaje) => {
    const mantenimiento = {
      iddispositivo: deviceId,
      observacion: mensaje,
      fecha: moment(new Date()).locale("en").format(),
    };
    setDesabilitarBoton(true);
    //console.log(mantenimiento);
    const response = await postMantenimiento(mantenimiento, tokenO);
    if (response.status === 200) {
      setDesabilitarBoton(false);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      setTextoIgresado("");
      setShow1(false);
    }
  };

  const handleShow = () => {
    setShow1(true);
  };

  const handleShow2 = (id) => {
    obtenerMantenimientos(id);
    setShow2(true);
  };

  const handleClose = () => {
    setShow1(false);
    setShow2(false);
  };

  // Agregando busqueda con Enter y verificando que no este vacio
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.value.trim() === "") {
        console.log("El campo no puede estar vacio");
        /*<Alert variant="outlined" severity="warning" sx={{ background: '#ffff' }} >El campo no puede estar vacío</Alert>*/
      } else {
        obtenerDispositivos();
      }
    }
  };

  const obtenerMantenimientos = async (id) => {
    try {
      const response = await getMantenimientos(id, tokenO);
      // console.log(response.data);
      if (response.status === 200) {
        setMantenimientos(response.data);
        //console.log(response.data);
      }
    } catch (error) {
      setMantenimientos([]);
      //console.log(bitacoras);
    }
  };


  // EMPIEZA RETORNO
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
        <div className="container-fluid">
          <span className="navbar-brand">
            <img
              src={LOGO}
              alt=""
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            TRACKER X
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                {admin !== 4 ? (
                  <Link
                    to={"/subirEquipos"}
                    state={{
                      email: email,
                      password: password,
                      tokenO: tokenO,
                      token: token,
                    }}
                    className="nav-link"
                  >
                    SUBIR EQUIPOS
                  </Link>
                ) : (
                  <span className="nav-link disabled">SUBIR EQUIPOS</span>
                )}
              </li>
              <li className="nav-item">
                <Link
                  to={"/usuariosPage"}
                  state={{
                    email: email,
                    password: password,
                    tokenO: tokenO,
                    token: token,
                    admin: admin,
                  }}
                  className="nav-link"
                >
                  USUARIOS
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={"/reportesPage"}
                  state={{
                    email: email,
                    password: password,
                    tokenO: tokenO,
                    token: token,
                    url: url,
                    admin: admin,
                  }}
                  className="nav-link"
                >
                  REPORTES
                </Link>
              </li>
            </ul>
            <Link
              to={"/pruebasLogin"}
              className="btn btn-outline-dark"
              type="submit"
            >
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </nav>
      <Container maxWidth="100%">
        <Row>
          <Col sm={6} style={{ marginTop: "10px" }}>
            <Col>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Buscar cliente"
                  style={{ height: "30px", marginRight: "10px" }} // Ajusta la altura aquí
                  onChange={(e) => setImei(e.target.value)}
                  onKeyDown={handleKeyDown} // Agrega el manejador de evento para detectar Enter
                />
                <IconButton
                  size="small"
                  title="Informacion"
                  onClick={obtenerDispositivos}
                  style={{ height: "30px" }}
                >
                  BUSCAR
                </IconButton>
              </div>
            </Col>
            <Paper
              style={{ maxHeight: "100px", overflow: "auto", marginTop: "4px" }}
            >
              <List>
                {dispositivos.map((device) => (
                  <div
                    key={device.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <ListItemButton
                      onClick={() => obtenerDispositivoSeleccionado(device)}
                    >
                      <ListItemText
                        primary={device.name}
                        secondary={`${device.uniqueId} - ${device.chasis}`}
                      />
                      <ListItemText
                        primary="CADUCA"
                        secondary={`${moment(device.fechafincontrato)
                          .locale("en")
                          .format(moment.HTML5_FMT.DATE)} `}
                      />
                      <ListItemText
                        primary="CHIP"
                        secondary={`${device.phone} `}
                      />
                      <IconButton
                        size="small"
                        title="AGREGAR OBSERVACION DE MANTENIMIENTO"
                        onClick={handleShow}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="MANTENIMIENTOS"
                        onClick={() => handleShow2(device.id)}
                      >
                        <BuildCircleIcon
                          fontSize="small"
                          style={{ color: "black" }}
                        />
                      </IconButton>
                    </ListItemButton>
                  </div>
                ))}
              </List>
            </Paper>
            <Container
              style={{
                //border: "2px solid #000",
                overflow: "auto",
                marginTop: "8px",
                height: "90%",
              }}
            >
              <Container style={{ overflow: "auto", marginTop: "10px" }}>
                <Typography variant="h6" gutterBottom>
                  DATOS DEL DISPOSITIVO
                </Typography>
                {dispositivoSeleccionado && (
                  <>
                    <TextField
                      value={dispositivoSeleccionado.name || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          name: event.target.value,
                        })
                      }
                      label="Nombre"
                      style={{
                        width: "40%",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <TextField
                      value={dispositivoSeleccionado.uniqueId || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          uniqueId: event.target.value,
                        })
                      }
                      label="Imei"
                      style={{
                        width: "48%",
                        marginLeft: "20px",
                        marginBottom: "10px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <select
                      style={{ width: "100%" }}
                      value={dispositivoSeleccionado.groupId}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          groupId: event.target.value,
                        })
                      }
                    >
                      <option value="">Selecciona un grupo</option>
                      {grupos.map((grupo) => (
                        <option key={grupo.id} value={grupo.id}>
                          {grupo.name}
                        </option>
                      ))}
                    </select>
                    {dispositivoSeleccionado.id && (
                      <LinkField
                        key={dispositivoSeleccionado.id}
                        endpointAll={`${url}/api/attributes/computed`}
                        endpointLinked={`${url}/api/attributes/computed?deviceId=${dispositivoSeleccionado.id}`}
                        token={token}
                        url={url}
                        email={email}
                        password={password}
                        baseId={dispositivoSeleccionado.id}
                        keyBase="deviceId"
                        keyLink="attributeId"
                        titleGetter={(it) => it.description}
                        label="Atributos Calculados"
                      />
                    )}
                    <TextField
                      value={dispositivoSeleccionado.phone || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          phone: event.target.value,
                        })
                      }
                      label="Nro. Chip"
                      style={{
                        width: "40%",
                        marginTop: "10px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <TextField
                      value={dispositivoSeleccionado.contact || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          contact: event.target.value,
                        })
                      }
                      label="Contacto"
                      style={{
                        width: "48%",
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <TextField
                      value={dispositivoSeleccionado.model || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          model: event.target.value,
                        })
                      }
                      label="Observaciones"
                      style={{
                        width: "90%",
                        marginTop: "10px",
                      }}
                    />
                    <TextField
                      label="Fecha Inicio"
                      type="date"
                      value={
                        (dispositivoSeleccionado.fechainiciocontrato &&
                          moment(dispositivoSeleccionado.fechainiciocontrato)
                            .locale("en")
                            .format(moment.HTML5_FMT.DATE)) ||
                        moment().locale("en").format(moment.HTML5_FMT.DATE)
                      }
                      onChange={(e) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          fechainiciocontrato: moment(
                            e.target.value,
                            moment.HTML5_FMT.DATE
                          )
                            .locale("en")
                            .format(),
                        })
                      }
                      style={{
                        width: "40%",
                        marginTop: "20px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <TextField
                      label="Fecha Vence"
                      type="date"
                      value={
                        (dispositivoSeleccionado.fechafincontrato &&
                          moment(dispositivoSeleccionado.fechafincontrato)
                            .locale("en")
                            .format(moment.HTML5_FMT.DATE)) ||
                        moment().locale("en").format(moment.HTML5_FMT.DATE)
                      }
                      onChange={(e) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          fechafincontrato: moment(
                            e.target.value,
                            moment.HTML5_FMT.DATE
                          )
                            .locale("en")
                            .format(),
                          expirationTime: moment(
                            e.target.value,
                            moment.HTML5_FMT.DATE
                          )
                            .locale("en")
                            .format(),
                        })
                      }
                      style={{
                        width: "48%",
                        marginTop: "20px",
                        marginLeft: "20px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <TextField
                      label="Fecha Recarga"
                      type="date"
                      value={
                        (dispositivoSeleccionado.fecharecarga &&
                          moment(dispositivoSeleccionado.fecharecarga)
                            .locale("en")
                            .format(moment.HTML5_FMT.DATE)) ||
                        moment().locale("en").format(moment.HTML5_FMT.DATE)
                      }
                      onChange={(e) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          fecharecarga: moment(
                            e.target.value,
                            moment.HTML5_FMT.DATE
                          )
                            .locale("en")
                            .format(),
                        })
                      }
                      style={{
                        width: "40%",
                        marginTop: "20px",
                      }}
                    />
                    <TextField
                      value={dispositivoSeleccionado.valorrecarga || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          valorrecarga: event.target.value,
                        })
                      }
                      label="Valor Recarga"
                      style={{
                        width: "48%",
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                    />
                    <TextField
                      value={dispositivoSeleccionado.aseguradora || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          aseguradora: event.target.value,
                        })
                      }
                      label="Asesor Comercial"
                      style={{
                        width: "40%",
                        marginTop: "10px",
                      }}
                    />
                    <TextField
                      value={dispositivoSeleccionado.placa || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          placa: event.target.value,
                        })
                      }
                      label="Placa"
                      style={{
                        width: "48%",
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                    />
                    <TextField
                      value={dispositivoSeleccionado.color || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          color: event.target.value,
                        })
                      }
                      label="Color"
                      style={{
                        width: "40%",
                        marginTop: "10px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <TextField
                      value={dispositivoSeleccionado.motor || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          motor: event.target.value,
                        })
                      }
                      label="Modelo"
                      style={{
                        width: "48%",
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    <TextField
                      value={dispositivoSeleccionado.chasis || ""}
                      onChange={(event) =>
                        setDispositivoSeleccionado({
                          ...dispositivoSeleccionado,
                          chasis: event.target.value,
                        })
                      }
                      label="Chasis"
                      style={{
                        width: "40%",
                        marginTop: "10px",
                      }}
                      disabled={admin === 4 ? true : false}
                    />
                    {position && (
                      <TextField
                        value={distanceFromMeters(item.totalDistance)}
                        onChange={(event) =>
                          setItem({
                            ...item,
                            totalDistance: distanceToMeters(
                              Number(event.target.value)
                            ),
                          })
                        }
                        label="Kilometraje"
                        style={{
                          width: "48%",
                          marginTop: "10px",
                          marginLeft: "20px",
                        }}
                      />
                    )}
                    <div
                      style={{
                        marginTop: "5px",
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        "& > *": {
                          flexBasis: "33%",
                        },
                      }}
                    >
                      <Button
                        style={{ marginTop: "20px" }}
                        variant="warning"
                        onClick={() => handleEdit()}
                      >
                        ACTUALIZAR DATOS
                      </Button>
                    </div>
                  </>
                )}
              </Container>
            </Container>
          </Col>
          <Col sm={6}>
            <Container>
              <Row style={{ position: "relative", top: "15%" }}>
                <Map
                  currentPosition={currentPosition}
                  device={dispositivoSeleccionado}
                  mapType={tipoMapa}
                />
                {position && estado && (
                  <StatusCard
                    device={dispositivoSeleccionado}
                    position={position}
                    token={token}
                    estate={estado}
                  />
                )}
                <MapSelector onTipoMapaChange={handleTipoMapaChange} />
                {position && estado && (
                  <FloatingPanel position={position} estado={estado} />
                )}
                {position && evento && (
                  <Snackbar
                    open={openSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    style={{
                      top: "14%",
                      right: "40px",
                    }}
                  >
                    <Alert
                      variant="outlined"
                      severity="error"
                      sx={{ background: "#ffff" }}
                    >
                      {evento.attributes.alarm === "sos"
                        ? "SOS"
                        : "CORTE DE CORRIENTE"}
                    </Alert>
                  </Snackbar>
                )}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Snackbar
        open={false}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        style={{
          top: "14%",
          right: "40px",
        }}
      >
        <Alert
          variant="outlined"
          severity="warning"
          sx={{ background: "#ffff" }}
        >
          DISPOSITIVO NO ENCONTRADO
        </Alert>
      </Snackbar>
      <Snackbar open={open} autoHideDuration={2000} message="INGRESO EXITOSO" />
      <Modal
        show={show1}
        onHide={handleClose}
        size="xs"
        aria-labelledby="contained
      -modal-tittle-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-tittle-vcenter">
            AGREGAR OBSERVACION DE MANTENIMIENTO
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Form.Group className="mb-3" controlId="example">
                <Form.Label>Ingrese la observacion</Form.Label>
                <Form.Control
                  as="textarea"
                  onChange={handleInputChange}
                  value={textoIngresado}
                ></Form.Control>
              </Form.Group>
              <Container style={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="warning"
                  disabled={desabilitarBoton}
                  onClick={() =>
                    insertarMantenimiento(
                      dispositivoSeleccionado.id,
                      textoIngresado
                    )
                  }
                >
                  GUARDAR
                </Button>
              </Container>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal
        show={show2}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-tittle-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-tittle-vcenter">
            HISTORIAL MANTENIMIENTOS AGENDADOS
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Paper
            style={{ maxHeight: 200, overflow: "auto", paddingLeft: "12px" }}
          >
            <List>
              {mantenimientos.map((mantenimiento) => (
                <ListItemText>
                  <Grid container spacing={2}>
                    <Grid item xs={3} sx={{ borderRight: "2px solid #ccc" }}>
                      <Typography>
                        <strong>
                          {moment
                            .utc(mantenimiento.fecha)
                            .format("YYYY-MM-DD | HH:mm")}
                        </strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{mantenimiento.observacion}</Typography>
                    </Grid>
                  </Grid>
                </ListItemText>
              ))}
            </List>
          </Paper>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function MapSelector({ onTipoMapaChange }) {
  return (
    <>
      <Paper
        style={{
          position: "absolute",
          top: "20%",
          padding: "0px",
          right: "10px",
          width: "5%",
          zIndex: 1000, // Ensure it's above the map
        }}
      >
        <CardActions disableSpacing style={{ flexDirection: "column" }}>
          <IconButton onClick={() => onTipoMapaChange("normal")}>
            <MapIcon />
          </IconButton>
          <IconButton onClick={() => onTipoMapaChange("satellite")}>
            <SatelliteAltIcon />
          </IconButton>
        </CardActions>
      </Paper>
    </>
  );
}
