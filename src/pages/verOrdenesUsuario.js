import React, { useEffect, useState } from 'react';
import '../assets/css/orden.css';
import {useLocation} from 'react-router-dom';
import { getOrdenId, getOrdenUserId } from '../services/apiRest.js';
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
import Pagination from '../components/Pagination.js';
import {Table} from 'react-bootstrap-v5';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
//import Pagination from '../components/Pagination.js';
import {FaSearch} from 'react-icons/fa';



function VerOrdenUser() {
   const location = useLocation();
   const [ordenes, setOrdenes] = useState([]); 
   const token = location.state.token;
   const idUsuario= location.state.idUsuario;
   const [currentPage, setCurrentPage] = useState(1);
   const [postPerPage] = useState(10);
   const [selectedData, setSelectedData] = useState([]);
   const [show, setShow] = useState(false);
   const [query,setQuery] = useState("");
  
  
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

    useEffect(() =>{
      async function cargarOrdenesUsuario(){
          const response = await getOrdenUserId(idUsuario,token);
          setOrdenes(response.data);
      }
      cargarOrdenesUsuario();
    }, [idUsuario,token]);
      
    const showDetail = async (id) => {
      const response = await getOrdenId(id,token);
      setSelectedData(response.data);
      handleShow();
     ;
    }

        //console.log(ordenes[1].nombreCliente + "ordenes");
        const indexOfLastPost = currentPage * postPerPage;
        const indexOfFirstPost = indexOfLastPost - postPerPage;
        const currentPosts = ordenes.filter(ordenes=>ordenes.nombreCliente.toLowerCase().includes(query.toLowerCase())).slice(indexOfFirstPost,indexOfLastPost);
        //paginas filtro
        const pageFilter = ordenes.filter(ordenes=>ordenes.nombreCliente.toLowerCase().includes(query.toLowerCase())).length;

        const pageNumbers = [];
        for(let i = 1; i <= Math.ceil(pageFilter/ postPerPage); i++){
        pageNumbers.push(i);
        }

        const paginate = (number) => 
        setCurrentPage(number);


      return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning" style={{ position: "fixed", top: 0, width: "100%", zIndex: 100 }}>
        <div className="container-fluid">
          <span className="navbar-brand" >
          <img src={LOGO} alt="" width="30" height="24" class="d-inline-block align-text-top"/>
            TRACKER X
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <div className="navbar-nav">
                <Link className="nav-link" to={"/formulario"} state={{token:token, idUsuario:idUsuario}}>Formulario</Link>
            </div>
          </ul>
         
          <form class="d-flex">
            <Link to={"/"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
          </form>
          </div>
        </div>
      </nav>
      <div className='container my-8' style={{ marginTop: '4rem', flex: 1 }}> 
      <h3 className='text-center'>LISTADO DE ORDENES DE ACTIVACIÓN</h3>
          <br></br>
          <div className='container'>
              <div className='row'>
                  <div className="col-md-8">                       
                        <input type="text" placeholder="Buscar cliente.." className="search h-50" onChange={e=> setQuery(e.target.value)}></input>
                        <FaSearch />
                  </div>   
              </div>                 
            </div>    
      <Table className='table table-dark table-hover table-bordered align-middle table-responsive'>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Fecha de envío</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Detalles</th>
            </tr>
        </thead>
        <tbody>       
                {currentPosts.map(currentPosts => (
                <tr className='table-light'>
                     <td>{currentPosts.nombreCliente}</td>
                     <td>{moment(currentPosts.fecha).locale('es').format(moment.HTML5_FMT.DATE)}</td>
                     <td>{currentPosts.telefono1}</td>
                     { !currentPosts.estado ? <td className='table-active table-danger'>POR CREAR</td>:<td className='table-success'>CREADO</td>}
                     <td><Button className='btn btn-secondary' onClick={(e)=>showDetail(currentPosts.idordenTrabajo)}>VER DATOS</Button>
                     {/*{' '} <Link to={"/editar"} class="btn btn-primary" type="submit" state={{token:token, orden: currentPosts,  idUsuario:idUsuario}}>EDITAR</Link>*/} </td>                   
                </tr>
                ))}
           
        </tbody>
       </Table>  
       <Pagination postPerPage={postPerPage} totalPosts={ordenes.length} paginate={paginate}></Pagination>
      </div>
      <div>
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
      </div>
      <Modal show={show} onHide={handleClose} size="xl"
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
                  <label className="form-label fw-bold">Fecha de envío:</label> <label className="form-label"> {moment(selectedData.fecha).locale('en').format(moment.HTML5_FMT.DATE)}</label>
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
                  <label className="form-label fw-bold">Contacto de Emergencia:</label> <label className="form-label"> {selectedData.nombreEmergencia}</label>
                  </Col>
                  <Col xs={4} md={4}>
                  <label className="form-label fw-bold">Teléfono Emergencia:</label> <label className="form-label"> {selectedData.telefono2}</label>
                  </Col>
                  <Col xs={8}>
                  <label className="form-label fw-bold">Email Emergencia:</label> <label className="form-label"> {selectedData.correoEmergencia}</label>
                  </Col>
                  <Col xs={8}>
                  <label className="form-label fw-bold">Vendedor:</label> <label className="form-label"> {selectedData.vendedor}</label>
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
      


export default VerOrdenUser