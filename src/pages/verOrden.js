import React, { useEffect, useState } from 'react';
import '../assets/css/orden.css';
import { useLocation } from 'react-router-dom';
import { getOrden, getOrdenId, postObservacionEliminarOrden, updateCredenciales, updateEstado, updateInstalado } from '../services/apiRest.js';
import { Form, Table } from 'react-bootstrap-v5';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
//import Pagination from '../components/Pagination.js';
import { FaSearch } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import { IconButton, Snackbar } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


function VerOrden() {
  const location = useLocation();
  const [ordenes, setOrdenes] = useState([]);
  const tokenO = location.state.token;
  const [selectedData, setSelectedData] = useState({});
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [show1, setShow1] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [eliminarOrden, setEliminarOrden] = useState({
    nombre: '',
    solicitador: '',
    motivo: '',
    idOrden: ''
  });

  const [filtros, setFiltros] = useState({
    creado: false,
    nocreado: true,
    daule: false,
  })

  const handleOptionChange = (event) => {
    const { name, checked } = event.target;
    setFiltros({ ...filtros, [name]: checked })
  }

  const ordenesFiltradas = ordenes.filter((orden) => {
    //console.log(orden.local);
    const ordenLocal = orden.local.toLowerCase();
    if (filtros.daule && ordenLocal.includes('daule') && filtros.nocreado && orden.estado === 0 ) {
      console.log('contiene daule')
      return true;
    }
    else if (filtros.daule && ordenLocal.includes('daule') && filtros.creado && orden.estado === 1 ) {
      console.log('contiene daule')
      return true;
    }
    else if (filtros.daule && ordenLocal.includes('daule') && !filtros.creado && !filtros.nocreado) {
      console.log('contiene daule')
      return true;
    }
    else if (filtros.creado && orden.estado === 1  && !filtros.daule && !ordenLocal.includes('daule')) {
      return true;
    }
    else if (filtros.nocreado && orden.estado === 0 && !filtros.daule && !ordenLocal.includes('daule')) {
      return true;
    }
    return false;
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowModalEliminar = (id) => {
    setEliminarOrden({ ...eliminarOrden, idOrden: id })
    setShow1(true);
  };

  const insertarElimidado = async () => {
    try {
      const response = await postObservacionEliminarOrden(eliminarOrden, tokenO);
      if (response.status === 200) {
        const response = await updateEstado(3, eliminarOrden.idOrden, tokenO);
        console.log(response);
        const response1 = await getOrden(tokenO);
        console.log(response1.data);
        setOrdenes(response1.data);
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 4000);
        setShow1(false);
      }
    } catch (error) {
      console.log(error);
    }

  }

  const handleClose1 = () => setShow1(false);

  useEffect(() => {
    //console.log(response.data);
    async function cargarOrdenes() {
      const response = await getOrden(tokenO);
      // console.log(response.data);
      setOrdenes(response.data);

    }
    cargarOrdenes();
  }, [tokenO]);

  const actualizarEstados = async (estado, id, tipo) => {
    console.log(estado);
    if (tipo === 1) {
      await updateEstado(estado, id, tokenO);
    }
    else if (tipo === 2) {
      await updateInstalado(estado, id, tokenO);
    } else if (tipo === 3) {
      await updateCredenciales(estado, id, tokenO);
    }
    const response1 = await getOrden(tokenO);
    console.log(response1.data);
    setOrdenes(response1.data);
  }

  /*const eliminarOrden = async (id) => {
    const response = await deleteEstado(id, tokenO);
    console.log(response.data);
    const response1 = await getOrden(tokenO);
    console.log(response.data);
    setOrdenes(response1.data);
  }*/
  const showDetail = async (id) => {
    const response = await getOrdenId(id, tokenO);
    setSelectedData(response.data);
    handleShow();
    ;
  }

  //console.log(ordenes[1].nombreCliente + "ordenes");
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const filtradosNombre = ordenesFiltradas.filter(ordenesFiltradas => ordenesFiltradas.nombreCliente.toLowerCase().includes(query.toLowerCase())).slice(indexOfFirstPost, indexOfLastPost);
  const filtradosChasis = ordenesFiltradas.filter(ordenesFiltradas => ordenesFiltradas.chasis.toLowerCase().includes(query.toLowerCase())).slice(indexOfFirstPost, indexOfLastPost);
  const currentPosts = [...filtradosNombre, ...filtradosChasis].filter(
    (valor, indice, self) => self.indexOf(valor) === indice
  );

  const pageFilter = ordenesFiltradas.filter(ordenesFiltradas => ordenesFiltradas.nombreCliente.toLowerCase().includes(query.toLowerCase())).length;
  //PAGINACION

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(pageFilter / postPerPage); i++) {
    pageNumbers.push(i);
  }

  /* const paginate = (number) => {
      console.log(number);
       setCurrentPage(number);
     
   };*/

  /*const handleChange = (event, value) => {
    setCurrentPage(value);
  };*/

  const handlePageChange = (event, value) => {
    console.log(value)
    setCurrentPage(value);
  };


  /*const renderPageNumbers = pageNumbers.map(number => {
    const isActive = currentPage === number;
    const isInRange = number < maxLimit + 1 && number > minLimit;
  
    if (isInRange) {
      return (
        <li key={number} className={isActive ? "active" : null}>
          <button onClick={() => paginate(number)} className='page-link'>
            {number}
          </button>
        </li>
      );
    }
  
    return null;
  });*/


  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-warning" style={{ position: "fixed", top: 0, width: "100%", zIndex: 100 }}>
          <div className="container-fluid">
            <span className="navbar-brand" >
              <img src={LOGO} alt="" width="30" height="24" className="d-inline-block align-text-top" />
              TRACKER X
            </span>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <div className="navbar-nav">
                  <Link className="nav-link" to={"/usuarios"} state={{ tokenO: tokenO }} aria-current="page">Usuarios </Link>
                </div>
              </ul>
              <form className="d-flex">
                <Link to={"/"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
              </form>
            </div>
          </div>
        </nav>
        <div className='container my-6' style={{ marginTop: '3.5rem', alignContent: 'center' }}>
          <h3 className='text-center'>LISTADO DE ORDENES DE ACTIVACIÓN</h3>
          <div className='container'>
            <div className='row'>
              <div className="col-md-6">
                <input type="text" placeholder="Buscar cliente.." className="search h-50" onChange={e => setQuery(e.target.value)}></input>
                <FaSearch />
              </div>
              <div className="col-md-2">
                <label>
                  <input
                    type="checkbox"
                    name="creado"
                    checked={filtros.creado}
                    onChange={handleOptionChange}
                  />
                  {' '} CREADOS
                </label>
                <> </>
                <label>
                  <input
                    type="checkbox"
                    name="nocreado"
                    checked={filtros.nocreado}
                    onChange={handleOptionChange}
                  />
                  {' '} NO CREADOS
                </label>
                <> </>
                <label>
                  <input
                    type="checkbox"
                    name="daule"
                    checked={filtros.daule}
                    onChange={handleOptionChange}
                  />
                  {' '} DAULE
                </label>

              </div>
            </div>
          </div>
          <div>
            <Table className='table table-dark table-hover table-bordered align-middle table-responsive' style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Usuario</th>
                  <th>Chasis</th>
                  <th>Estado</th>
                 
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map(currentPost => (
                  <tr className={!currentPost.instalado ? 'table-light' : 'table-primary'} key={currentPost.idordenTrabajo} >
                    <td>{currentPost.nombreCliente}</td>
                    <td>{currentPost.local}</td>
                    <td>{currentPost.chasis}</td>
                    {(!currentPost.estado && currentPost.estado !== 3) ? <td className='table-active table-danger'>POR CREAR</td> : <td className='table-success'>CREADO</td>}
      
                    <td>
                      <IconButton onClick={(e) => { e.stopPropagation(); actualizarEstados(currentPost.estado === 1 ? 0 : 1, currentPost.idordenTrabajo, 1) }} title="CREAR"><CheckBoxIcon fontSize="medium" /></IconButton>
                      <IconButton onClick={(e) => { e.stopPropagation(); actualizarEstados(currentPost.instalado === 1 ? 0 : 1, currentPost.idordenTrabajo, 2) }} title="INSTALAR"><NoCrashIcon fontSize="medium" /></IconButton>
                      <IconButton onClick={(e) => { e.stopPropagation(); showDetail(currentPost.idordenTrabajo)} } title="VER DATOS"><MarkEmailReadIcon fontSize="medium" /></IconButton>
                      <Link to={"/editar"} type="submit" state={{ token: tokenO, orden: currentPost, idUsuario: currentPost.idusuario }}><IconButton title="EDITAR">
                        <EditNoteIcon fontSize="medium" />
                      </IconButton></Link>
                      <IconButton className='btn btn-danger' onClick={(e) => { e.stopPropagation(); handleShowModalEliminar(currentPost.idordenTrabajo) }} title="ELIMINAR ORDEN"><DeleteIcon fontSize="medium" /></IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Stack spacing={2}>
            <Pagination
              color="warning"
              key={currentPage}
              page={currentPage}
              onChange={handlePageChange}
              count={pageNumbers.length}
            />
          </Stack>
        </div>
        <footer className="bg-light py-4 mt-auto">
          <Container>
            <Row>
              <Col>
                <p className="text-center">© 2023 Tracker X. Todos los derechos reservados.</p>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
      <Modal show={show} onHide={handleClose} className="modal-xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>DATOS DEL CLIENTE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Nombre:</label> <label className="form-label"> {selectedData.nombreCliente}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Dirección:</label> <label className="form-label"> {selectedData.direccion}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Fecha de envío:</label> <label className="form-label"> {moment(selectedData.fecha).format(moment.HTML5_FMT.DATE)}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Teléfono:</label> <label className="form-label"> {selectedData.telefono1}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Local:</label> <label className="form-label"> {selectedData.local}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Email:</label> <label className="form-label"> {selectedData.email}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Contacto/Emergencia:</label> <label className="form-label"> {selectedData.nombreEmergencia}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Teléfono Emergencia:</label> <label className="form-label"> {selectedData.telefono2}</label>
              </Col>
              <Col xs={4}>
                <label className="form-label fw-bold">Email/Emergencia:</label> <label className="form-label"> {selectedData.correoEmergencia}</label>
              </Col>
            </Row>
            <Row>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Chasis:</label> <label className="form-label"> {selectedData.chasis}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Motor:</label> <label className="form-label"> {selectedData.motor}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Año:</label> <label className="form-label"> {selectedData.anio}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Marca:</label> <label className="form-label"> {selectedData.marca}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Modelo:</label> <label className="form-label"> {selectedData.modelo}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Placa:</label> <label className="form-label"> {selectedData.placa}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Color:</label> <label className="form-label"> {selectedData.color}</label>
              </Col>
            </Row>
            <Row>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Plan:</label> <label className="form-label"> {selectedData.plan} Años</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Financiera:</label> <label className="form-label"> {selectedData.financiera}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Valor:</label> <label className="form-label"> {selectedData.valor} $</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Factura a nombre de:</label> <label className="form-label"> {selectedData.facturaNombre}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Ruc:</label> <label className="form-label"> {selectedData.ruc}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">Vendedor:</label> <label className="form-label"> {selectedData.vendedor}</label>
              </Col>
              <Col xs={4} md={4}>
                <label className="form-label fw-bold">IMEI:</label> <label className="form-label"> {selectedData.imei}</label>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      <Modal show={show1} onHide={handleClose1} size='xs' aria-labelledby='contained
      -modal-tittle-vcenter' centered>
        <Modal.Header>
          <Modal.Title id='contained-modal-tittle-vcenter'>
            AGREGAR OBSERVACION DE MANTENIMIENTO
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Form.Group className='mb-3' controlId='example'>
                <Form.Label>
                  Nombre
                </Form.Label>
                <Form.Control as="input" onChange={(event) => setEliminarOrden({ ...eliminarOrden, nombre: event.target.value })} value={eliminarOrden.value}>
                </Form.Control>
                <Form.Label>
                  Solicitado por:
                </Form.Label>
                <Form.Control as="input" onChange={(event) => setEliminarOrden({ ...eliminarOrden, solicitador: event.target.value })} value={eliminarOrden.solicitador}>
                </Form.Control>
                <Form.Label>
                  Motivo
                </Form.Label>
                <Form.Control as="textarea" onChange={(event) => setEliminarOrden({ ...eliminarOrden, motivo: event.target.value })} value={eliminarOrden.motivo}>
                </Form.Control>
              </Form.Group>
              <Container style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant='warning' onClick={insertarElimidado}>
                  GUARDAR
                </Button>
              </Container>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        message="INGRESO EXITOSO"
      />
    </>
  );
}



export default VerOrden