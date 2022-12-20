import React, { useEffect, useState } from 'react';
import '../assets/css/orden.css';
import {useLocation} from 'react-router-dom';
import { getOrden, getOrdenId, updateEstado } from '../services/apiRest.js';
import {Table} from 'react-bootstrap-v5';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
import Pagination from '../components/Pagination.js';

function VerOrden() {
   const location = useLocation();
   const [ordenes, setOrdenes] = useState([]); 
   const tokenO = location.state.token;
   const [selectedData, setSelectedData] = useState({});
   const [show, setShow] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [postPerPage] = useState(10);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const refresh = () => window.location.reload(true);

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
      console.log(response.data);
      refresh();
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
    const currentPosts = ordenes.slice(indexOfFirstPost,indexOfLastPost);
    //PAGINACION
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

      return (
      <>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
          <div className="container-fluid">
            <span className="navbar-brand" >
            <img src={LOGO} alt="" width="30" height="24" class="d-inline-block align-text-top"/>
              TRACKER X
            </span>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
               <div className="navbar-nav">
                <Link className="nav-link" to={"/usuarios"} state={{tokenO:tokenO}} aria-current="page">Usuarios </Link>            
                </div>               
            </div>
            <form class="d-flex">
              <Link to={"/"} class="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
            </form>
          </div>
        </nav>
      <div className='container my-5'>
          <h3 className='text-center'>LISTADO DE ORDENES DE ACTIVACIÓN</h3>
          <br></br>
      <Table className='table table-dark table-hover table-bordered align-middle table-responsive'>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Fecha de envío</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Detalles</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody>       
                {currentPosts.map(currentPosts => (
                <tr className='table-light'>
                     <td>{currentPosts.nombreCliente}</td>
                     <td>{currentPosts.fecha}</td>
                     <td>{currentPosts.telefono1}</td>
                     { !currentPosts.estado ? <td className='table-active table-danger'>POR CREAR</td>:<td className='table-success'>CREADO</td>}
                     <td><Button className='btn btn-secondary' onClick={(e)=>showDetail(currentPosts.idordenTrabajo)}>VER DATOS</Button></td>
                     <td><button className='btn btn-success' onClick={(e)=>actualizarEstado(1,currentPosts.idordenTrabajo)}>CREAR</button></td>
                </tr>
                ))}
           
        </tbody>
       </Table>  
       <Pagination postPerPage={postPerPage} totalPosts={ordenes.length} paginate={paginate}></Pagination>
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
                  <label className="form-label fw-bold">Fecha de envío:</label> <label className="form-label"> {selectedData.fecha}</label>
                  </Col>
                  <Col xs={4} md={4}>
                  <label className="form-label fw-bold">Teléfono:</label> <label className="form-label"> {selectedData.telefono1}</label>
                  </Col>
                  <Col xs={4} md={4}>
                  <label className="form-label fw-bold">Email:</label> <label className="form-label"> {selectedData.email}</label>
                  </Col>
                  <Col xs={4} md={4}>
                  <label className="form-label fw-bold">Contacto de Emergencia:</label> <label className="form-label"> {selectedData.nombreEmergencia}</label>
                  </Col>
                  <Col xs={4} md={4}>
                  <label className="form-label fw-bold">Teléfono Emergencia:</label> <label className="form-label"> {selectedData.telefono2}</label>
                  </Col>
                  <Col xs={8}>
                  <label className="form-label fw-bold">Email Emergencia:</label> <label className="form-label"> {selectedData.correoEmergencia}</label>
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
                  <label className="form-label fw-bold">Vendedor:</label> <label className="form-label"> {selectedData.vendedor}</label>
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