import React, { useEffect, useState } from 'react';
import '../assets/css/orden.css';
import {useLocation} from 'react-router-dom';
import { deleteEstado, getOrden, getOrdenId, updateEstado } from '../services/apiRest.js';
import {Table} from 'react-bootstrap-v5';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
//import Pagination from '../components/Pagination.js';
import {FaSearch,FaCheckSquare,FaTrash,FaEdit} from 'react-icons/fa';
import moment from 'moment';

function VerOrden() {
   const location = useLocation();
   const [ordenes, setOrdenes] = useState([]);
   const tokenO = location.state.token;
   const [selectedData, setSelectedData] = useState({});
   const [show, setShow] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [postPerPage] = useState(10);
   const [query,setQuery] = useState("");
   const pageNumberLimit= 5;
   const [maxLimit, setMaxLimit] = useState(5);
   const [minLimit, setMinLimit] = useState(0);
   
   const [filtros, setFiltros] = useState ({
     creado: false,
     nocreado: true,
   })

  const handleOptionChange = (event) => {
    const {name, checked} = event.target;
    setFiltros({...filtros, [name]: checked})
  }

  const ordenesFiltradas = ordenes.filter ((orden) => {
    if(filtros.creado && orden.estado === 1) {
      return true;
    }
    if(filtros.nocreado && orden.estado === 0) {
      return true;
    }
    return false;
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


    useEffect(() =>{

      async function cargarOrdenes(){
          const response = await getOrden(tokenO);
         // console.log(response.data);
         setOrdenes(response.data);

      }
      cargarOrdenes();
    }, [tokenO]);
      
    const actualizarEstado = async (estado,id) =>{
      console.log(estado);
      const response = await updateEstado(estado,id,tokenO);
      console.log(response);
      const response1 = await getOrden(tokenO);
          console.log(response1.data);
          setOrdenes(response1.data);
    }

    const eliminarOrden = async (id) => {
      const response = await deleteEstado(id,tokenO);
      console.log(response.data);
      const response1 = await getOrden(tokenO);
         console.log(response.data);
          setOrdenes(response1.data);
    }
    const showDetail = async (id) => {
      const response = await getOrdenId(id,tokenO);
      setSelectedData(response.data);
      handleShow();
     ;
    }

    //console.log(ordenes[1].nombreCliente + "ordenes");
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const filtradosNombre = ordenesFiltradas.filter(ordenesFiltradas=> ordenesFiltradas.nombreCliente.toLowerCase().includes(query.toLowerCase())).slice(indexOfFirstPost,indexOfLastPost);
    const filtradosChasis = ordenesFiltradas.filter(ordenesFiltradas=> ordenesFiltradas.chasis.toLowerCase().includes(query.toLowerCase())).slice(indexOfFirstPost,indexOfLastPost);
    const currentPosts = [...filtradosNombre, ...filtradosChasis].filter(
      (valor, indice, self) => self.indexOf(valor) === indice
    );
    
    const pageFilter = ordenesFiltradas.filter(ordenesFiltradas=>ordenesFiltradas.nombreCliente.toLowerCase().includes(query.toLowerCase())).length;
    //PAGINACION

    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(pageFilter/ postPerPage); i++){
    pageNumbers.push(i);
    }

    const paginate = (number) => 
      setCurrentPage(number);
    ;

    const renderPageNumbers = pageNumbers.map(number => { if (number < maxLimit + 1 && number > minLimit) {
      return (
        <li key={number} className={currentPage === number ? "active" : null}>
              <button onClick={() => paginate(number)}className='page-link'>{number}</button>              
        </li>
      )
  } else {
    return null;
  }  
  });

  const handleNext = () => {
    setCurrentPage(currentPage+1);
    if(currentPage + 1 > maxLimit){
      setMaxLimit(maxLimit + pageNumberLimit);
      setMinLimit(minLimit + pageNumberLimit);
    }
  }

  const handlePrev = () => {
    setCurrentPage(currentPage-1);
    if((currentPage - 1)%pageNumberLimit===0){
      setMaxLimit(maxLimit - pageNumberLimit);
      setMinLimit(minLimit - pageNumberLimit);
    }
  }
      return (
      <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning" style={{ position: "fixed", top: 0, width: "100%", zIndex: 100 }}>
          <div className="container-fluid">
            <span className="navbar-brand" >
            <img src={LOGO} alt="" width="30" height="24" className="d-inline-block align-text-top"/>
              TRACKER X
            </span>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
               <div className="navbar-nav">
                <Link className="nav-link" to={"/usuarios"} state={{tokenO:tokenO}} aria-current="page">Usuarios </Link>            
                </div>
                </ul>               
            <form class="d-flex">
              <Link to={"/"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
            </form>
            </div>
          </div>
        </nav>
        <div className='container my-6' style={{ marginTop: '6rem' }}>
                <h3 className='text-center'>LISTADO DE ORDENES DE ACTIVACIÓN</h3>
                <br></br> 
            <div className='container'>
              <div className='row'>
                  <div className="col-md-6">                       
                        <input type="text" placeholder="Buscar cliente.." className="search h-50" onChange={e=> setQuery(e.target.value)}></input>
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
                  </div>   
              </div>               
            </div>            
      <Table className='table table-dark table-hover table-bordered align-middle table-responsive'>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Fecha de envío</th>
                <th>Usuario</th>
                <th>Chasis</th>
                <th>Estado</th>
                <th>Detalles</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody>       
                {currentPosts.map(currentPosts => (
                <tr className='table-light'>
                     <td>{currentPosts.nombreCliente}</td>
                     <td>{moment(currentPosts.fecha).format(moment.HTML5_FMT.DATE)}</td>
                     <td>{currentPosts.local}</td>
                     <td>{currentPosts.chasis}</td>
                     { !currentPosts.estado ? <td className='table-active table-danger'>POR CREAR</td>:<td className='table-success'>CREADO</td>}
                     <td><Button className='btn btn-secondary' onClick={(e)=>showDetail(currentPosts.idordenTrabajo)}>VER DATOS</Button></td>
                     <td><Button className='btn btn-success' onClick={(e)=>actualizarEstado(1,currentPosts.idordenTrabajo)}><FaCheckSquare style={{ fontSize: '1.4em', verticalAlign: "middle"}} /></Button>
                     {' '} <Link to={"/editar"} className="btn btn-primary" type="submit" state={{token:tokenO, orden: currentPosts,  idUsuario:currentPosts.idusuario}}><FaEdit style={{ fontSize: '1.4em' , verticalAlign: "middle" }}/></Link>  
                     {' '}<Button className='btn btn-danger' onClick={(e)=>eliminarOrden(currentPosts.idordenTrabajo)}><FaTrash style={{ fontSize: '1.2em' , verticalAlign: "middle" }}/></Button>
                     </td>
                </tr>
                ))}
           
        </tbody>
       </Table>  
       <ul className='pageNumbers'>
        <li>
          <button onClick={handlePrev} disabled={currentPage === pageNumbers[0] ? true : false}>
            ANTERIOR
          </button>
        </li>
        {renderPageNumbers}
        <li>
        <button onClick={handleNext} disabled={currentPage === pageNumbers.length ? true : false}>
            SIGUIENTE
          </button>
        </li>
        </ul>
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
     
      </>     
      );
    }
      


export default VerOrden