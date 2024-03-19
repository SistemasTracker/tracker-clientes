import React, { useState } from 'react';
import '../assets/css/formulario.css';
import {FaUserAlt,FaMapMarked,FaUserTie,FaPhone,FaEnvelope,FaRegBookmark,FaStore} from 'react-icons/fa';
import {Form, Formik} from 'formik';
//Naavegador de páginas
import {useLocation} from 'react-router-dom';
import { crearOrden } from '../services/apiRest.js';
//Guardar token
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
import jsPDF from 'jspdf';
import moment from 'moment';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap-v5';
import 'bootstrap/dist/css/bootstrap.min.css';
//PDF

function FormularioOrden() {
  const location = useLocation();
  const idUsuario = location.state.idUsuario;
  const token = location.state.token;
  console.log(token);
  const [show, setShow] =  useState(false);
  const [show1, setShow1] =  useState(false);
  const [show2, setShow2] =  useState(false);
  const handleClose = () => {
    setShow(false);
    setShow1(false);
    setShow2(false);
  }
  
  const handleOpen = () => setShow(true);

return (
  <Formik initialValues={
    {
      fecha: new Date(),
      nombreCliente:"",
      vendedor:"",
      direccion:"",
      telefono1:"",
      email:"",
      nombreEmergencia:"",
      telefono2:"",
      correoEmergencia:"",
      chasis:"",
      motor:"",
      marca:"",
      modelo:"",
      placa:"",
      color:"",
      idusuario: idUsuario,
      plan:1,
      financiera:"",
      anio:"",
      local:"",
      valor:"",
      facturaNombre:"",
      ruc:"",
      imei:"",
      chip:""
    }
  }
  onSubmit={async (values, actions)=>{

    console.log(values);
    try {
        values.fecha = moment(values.fecha).locale('en').format();
        const response = await crearOrden(values);
        console.log(response);  
        setShow1(true);
        
              var plan1 = values.plan.toString();
              var doc = new jsPDF('portrait','px');
              doc.setDrawColor(0,0,0);
              doc.setFillColor(238,201,47)
              doc.rect(0,0,500,35,'F')
              doc.addImage(LOGO,'png',15,2,40,30)
              doc.setFontSize(18);
              doc.setFont('Helvertica', 'bold');
              doc.text(160,20,'ORDEN DE ACTIVACIÓN')
              doc.setFontSize(12);
              doc.setFillColor(238,201,47)
              doc.rect(35,45,370,13,'F')
              doc.text(40,55,'DATOS DEL CLIENTE')
              doc.setFont('Helvertica', 'normal');
              doc.rect(35,60,370,155)
              doc.text(40,70,'FECHA DE SOLICITUD:'); doc.text(200,70,moment(values.fecha).format(moment.HTML5_FMT.DATE));
              doc.text(40,85,'VENDEDOR:'); doc.text(200,85, values.vendedor);
              doc.text(40,100,'LOCAL:'); doc.text(200,100, values.local);
              doc.text(40,115,'NOMBRE DEL CLIENTE:'); doc.text(200,115, values.nombreCliente);
              doc.text(40,130,'TELÉFONO:'); doc.text(200,130, values.telefono1);
              doc.text(40,145,'EMAIL:'); doc.text(200,145, values.email);
              doc.text(40,160,'DIRECCIÓN:'); doc.text(200,160, values.direccion);
              doc.text(40,175,'CONTACTO EMERGENCIA:'); doc.text(200,175, values.nombreEmergencia);
              doc.text(40,190,'TELÉFONO EMERGENCIA:'); doc.text(200,190, values.telefono2);
              doc.text(40,205,'EMAIL EMERGENCIA:'); doc.text(200,205, values.correoEmergencia);
              doc.setFont('Helvertica', 'bold');
              doc.setFillColor(238,201,47)
              doc.rect(35,220,370,13,'F')
              doc.text(40,230,'DATOS DEL VEHÍCULO');      
              doc.setFont('Helvertica', 'normal');
              doc.rect(35,235,370,105)
              doc.text(40,245,'MARCA:'); doc.text(200,245, values.marca);
              doc.text(40,260,'MODELO:'); doc.text(200,260, values.modelo);
              doc.text(40,275,'AÑO:'); doc.text(200,275, values.anio);
              doc.text(40,290,'CHASIS:'); doc.text(200,290, values.chasis);
              doc.text(40,305,'COLOR:'); doc.text(200,305, values.color);
              doc.text(40,320,'PLACA:'); doc.text(200,320, values.placa);
              doc.text(40,335,'MOTOR:'); doc.text(200,335, values.motor);
              doc.setFont('Helvertica', 'bold');
              doc.setFillColor(238,201,47)
              doc.rect(35,345,370,13,'F')
              doc.text(40,355,'SERVICIOS')
              doc.setFont('Helvertica', 'normal');
              doc.rect(35,360,370,75)
              doc.text(40,370,'AÑOS DE SERVICIO:'); doc.text(200,370, plan1);
              doc.text(40,385,'VALOR $:'); doc.text(200,385, values.valor);
              doc.text(40,400,'FINANCIERA:'); doc.text(200,400, values.financiera);
              doc.text(40,415,'FACTURA A NOMBRE DE:'); doc.text(200,415, values.facturaNombre);
              doc.text(40,430,'RUC/CI:'); doc.text(200,430, values.ruc);
              doc.setFont('Helvertica', 'bold');
              doc.setFillColor(238,201,47)
              doc.rect(35,440,370,13,'F')
              doc.text(40,450,'DATOS DEL DISPOSITIVO')
              doc.setFont('Helvertica', 'normal');
              doc.rect(35,455,370,30)
              doc.text(40,465,'IMEI:');doc.text(200,465, values.imei);
              doc.line(35,470,405,470)
              doc.text(40,480,'CHIP:')
              doc.line(250,525,370,525)
              doc.text(280,540,'Firma del Cliente')
              doc.save('Activacion_'+values.nombreCliente+'.pdf');
            
              actions.resetForm();
    } catch (error) {
      console.log(error)
      setShow2(true);
    }
    
  }}
  >   
  {({handleChange, handleSubmit, values, isSubmitting})=>(
  <>
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
          <Link className="nav-link" to={"/ordenuser"} state={{token:token, idUsuario: idUsuario}}>Ordenes</Link>  
      </div>
      </ul>
    
    <form class="d-flex">
      <Link to={"/"} class="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
    </form>
    </div>
  </div>
</nav>
    
   <div className='container border border-3 p-5 my-6' style={{ marginTop: '6rem' }}>
    <Button variant='warning' onClick={handleOpen} style={{float: 'right'}} >¿Tienes alguna duda o necesitas información?</Button>
    <br></br>
    <br></br>
    <h3 className='text-center'><strong> FORMULARIO DE ORDEN DE ACTIVACIÓN</strong></h3>
    <br></br>
   <Form className="row" onSubmit={handleSubmit}>
        <div className='row'>
            <div className="col-xs-12 bg-warning">
              <label className="form-label">DATOS DEL CLIENTE</label>
            </div>
            <div className="col-md-4">            
                <label className="form-label fw-bold" ><FaUserAlt></FaUserAlt> NOMBRE CLIENTE</label>
                <input type="label" className="form-control" name='nombreCliente' onChange={handleChange} value={values.nombreCliente} required/>                            
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaMapMarked/> DIRECCIÓN</label>
              <input type="label" className="form-control" name='direccion' onChange={handleChange} value={values.direccion} required/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaPhone></FaPhone> TELÉFONO</label>
              <input type="label" className="form-control" name='telefono1' onChange={handleChange} value={values.telefono1} required/>
              <br></br>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaEnvelope></FaEnvelope> EMAIL</label>
              <input type="email" className="form-control" name='email' onChange={handleChange} value={values.email} required/>
              <br></br>
            </div>
        </div> 
        <div className='row'>
            <div className="col-md-4">            
            <label className="form-label fw-bold"><FaUserAlt></FaUserAlt> CONTACTO EMERGENCIA</label>
                <input type="label" className="form-control" name='nombreEmergencia' onChange={handleChange} value={values.nombreEmergencia}/>                            
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaPhone></FaPhone> TELÉFONO EMERGENCIA</label>
              <input type="label" className="form-control" name='telefono2' onChange={handleChange} value={values.telefono2}/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaEnvelope></FaEnvelope> EMAIL</label>
              <input type="email" className="form-control" name='correoEmergencia' onChange={handleChange} value={values.correoEmergencia}/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaUserTie></FaUserTie> VENDEDOR</label>
              <input type="label" className="form-control" name='vendedor' onChange={handleChange} value={values.vendedor} required/>
              <br></br>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaStore></FaStore> LOCAL</label>
              <input type="label" className="form-control" name='local' onChange={handleChange} value={values.local} required/>
              <br></br>
            </div>   
       </div>
       <div className='row'>  
       <div className="col-xs-12 bg-warning">
              <label className="form-label ">DATOS DEL VEHÍCULO</label>              
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaRegBookmark></FaRegBookmark> MARCA</label>              
              <input type="label" className="form-control" name='marca' onChange={handleChange} value={values.marca} required/>         
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"> MODELO</label>
              <input type="label" className="form-control" name='modelo' onChange={handleChange} value={values.modelo} required/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"> AÑO</label>
              <input type="label" className="form-control" name='anio' onChange={handleChange} value={values.anio} required/>
            </div>
            <div className="col-md-4">
            <label className="form-label fw-bold"> PLACA</label>
              <input type="label" className="form-control" name='placa' onChange={handleChange} value={values.placa} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"> CHASIS</label>
              <input type="label" className="form-control" name='chasis' onChange={handleChange} value={values.chasis} required/>
              
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"> COLOR</label>
              <input type="label" className="form-control" name='color' onChange={handleChange} value={values.color} required/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"> MOTOR</label>
              <input type="label" className="form-control" name='motor' onChange={handleChange} value={values.motor}/>
              <br></br>
            </div>
       </div>  
       <div className='row'>  
       <div className="col-xs-12 bg-warning">
              <label className="form-label ">SERVICIOS</label>              
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">AÑOS DE SERVICIO</label>              
              <input type="label" className="form-control" name='plan' onChange={handleChange} value={values.plan} required/>  
                   
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">IMEI DEL DISPOSITIVO</label>
              <input type="label" className="form-control" name='imei' onChange={handleChange} value={values.imei}/>
              <br></br>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">VALOR</label>              
              <input type="label" placeholder='$' className="form-control" name='valor' onChange={handleChange} value={values.valor} required/>  
                     
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">FINANCIERA</label>
              <input type="label" className="form-control" name='financiera' onChange={handleChange} value={values.financiera}/>
          
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">FACTURAR A NOMBRE DE</label>              
              <input type="label" className="form-control" name='facturaNombre' onChange={handleChange} value={values.facturaNombre}/>  
              <br></br>         
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">RUC</label>              
              <input type="label" className="form-control" name='ruc' onChange={handleChange} value={values.ruc}/>  
              <br></br>         
            </div>
       </div> 
       <div className="row justify-content-center">
          <div className='col-md-4'>
            <Button type="submit" className="btn btn-dark" centered > {isSubmitting ? "Enviando y descargando....." : "Enviar Orden y Descargar Archivo pdf"}</Button>
          </div>
       </div>     
   </Form>
 </div>
 <div>
 <footer className="bg-light py-4" style={{ marginTop: "auto" }}>
      <Container>
        <Row>
          <Col>
            <p className="text-center">© 2023 Tracker X. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
    </div>
    <Modal show={show} onHide = {handleClose} centered>
      <Modal.Header >
          <Modal.Title>CONTACTOS PARA AYUDA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='alert alert-info'> 
        Para solicitar un cambio en la información ingresada - 0987305823
        </div>
        <div className='alert alert-secondary'> 
        Para reportar alguna error o solicitar soporte en el ingreso de datos - 0983367940
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
    <Modal show={show1} onHide = {handleClose} centered>
      <Modal.Body>
        <div className='alert alert-success'>  
        FORMULARIO ENVIADO CON ÉXITO
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
    <Modal show={show2} onHide = {handleClose} centered>
      <Modal.Body>
        <div className='alert alert-danger'>
        ERROR!! FORMULARIO NO ENVIADO, REVISA LOS DATOS INGRESADOS O COMUNICATE A LOS NÚMEROS DE SOPORTE.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
    </>

  )}   
  </Formik>
  )
}

export default FormularioOrden