import React from 'react';
import '../assets/css/formulario.css';
import { FormControl } from "react-bootstrap";
import {FaUserAlt,FaMapMarked,FaCalendarAlt,FaUserTie,FaPhone,FaEnvelope,FaRegBookmark} from 'react-icons/fa';
import {Form, Formik} from 'formik';
//Naavegador de páginas
import {useLocation} from 'react-router-dom';
import { crearOrden } from '../services/apiRest.js';
//Guardar token
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';

function FormularioOrden() {

  const location = useLocation();
  const idUsuario = location.state.idUsuario;
  const token = location.state.token;
  console.log(token);
  
return (
  <Formik initialValues={
    {
      fecha: "",
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
      financiera:""
    }
  }
  onSubmit={async (values, actions)=>{
    console.log(values);
    try {
        const response = await crearOrden(values);
        console.log(response);
        
        actions.resetForm();
        alert('FORMULARIO ENVIADO EXITOSAMENTE');
    } catch (error) {
      console.log(error)
      alert('ERROR, FORMULARIO NO ENVIADO');
    }
    
  }}
  >   
  {({handleChange, handleSubmit, values, isSubmitting})=>(
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
          <Link className="nav-link" to={"/ordenuser"} state={{token:token, idUsuario: idUsuario}}>Ordenes</Link>  
      </div>
    </div>
    <form class="d-flex">
      <Link to={"/"} class="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
    </form>
  </div>
</nav>
   <div className='container border border-3 p-5 my-5'>
    <h3 className='text-center'>FORMULARIO DE ORDEN DE ACTIVACIÓN</h3>
    <br></br>
   <Form className="row" onSubmit={handleSubmit}>
        <div className='row'>
            <div className="col-xs-12 bg-warning">
              <label className="form-label">DATOS DEL CLIENTE</label>
            </div>
            <div className="col-md-4">            
                <label className="form-label fw-bold" ><FaUserAlt></FaUserAlt> Nombre de cliente</label>
                <input type="label" className="form-control" name='nombreCliente' onChange={handleChange} value={values.nombreCliente} required/>                            
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaMapMarked/> Dirección</label>
              <input type="label" className="form-control" name='direccion' onChange={handleChange} value={values.direccion} required/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaCalendarAlt></FaCalendarAlt> Fecha</label>
              <FormControl type="date" name="fecha" onChange={handleChange} value={values.fecha} required/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaPhone></FaPhone> Teléfono</label>
              <input type="label" className="form-control" name='telefono1' onChange={handleChange} value={values.telefono1} required/>
              <br></br>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaEnvelope></FaEnvelope> Email</label>
              <input type="email" className="form-control" name='email' onChange={handleChange} value={values.email} required/>
              <br></br>
            </div>
        </div> 
        <div className='row'>
            <div className="col-md-4">            
            <label className="form-label fw-bold"><FaUserAlt></FaUserAlt> Contacto de Emergencia</label>
                <input type="label" className="form-control" name='nombreEmergencia' onChange={handleChange} value={values.nombreEmergencia}/>                            
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaPhone></FaPhone> Teléfono Emergencia</label>
              <input type="label" className="form-control" name='telefono2' onChange={handleChange} value={values.telefono2}/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaEnvelope></FaEnvelope> Email</label>
              <input type="email" className="form-control" name='correoEmergencia' onChange={handleChange} value={values.correoEmergencia}/>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaUserTie></FaUserTie> Vendedor</label>
              <input type="label" className="form-control" name='vendedor' onChange={handleChange} value={values.vendedor}/>
              <br></br>
            </div>     
       </div>
       <div className='row'>  
       <div className="col-xs-12 bg-warning">
              <label className="form-label ">DATOS DEL VEHÍCULO</label>              
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaRegBookmark></FaRegBookmark> Marca</label>              
              <input type="label" className="form-control" name='marca' onChange={handleChange} value={values.marca} required/>         
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Modelo</label>
              <input type="label" className="form-control" name='modelo' onChange={handleChange} value={values.modelo} required/>
            </div>
            <div className="col-md-4">
            <label className="form-label fw-bold">Placa</label>
              <input type="label" className="form-control" name='placa' onChange={handleChange} value={values.placa} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Chasis</label>
              <input type="label" className="form-control" name='chasis' onChange={handleChange} value={values.chasis} required/>
              <br></br>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Color</label>
              <input type="label" className="form-control" name='color' onChange={handleChange} value={values.color} required/>
              <br></br>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Motor</label>
              <input type="label" className="form-control" name='motor' onChange={handleChange} value={values.motor}/>
              <br></br>
            </div>
       </div>  
       <div className='row'>  
       <div className="col-xs-12 bg-warning">
              <label className="form-label ">SERVICIOS</label>              
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">PLAN</label>              
              <input type="label" className="form-control" name='plan' onChange={handleChange} value={values.plan}/>  
              <br></br>         
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">FINANCIERA</label>
              <input type="label" className="form-control" name='financiera' onChange={handleChange} value={values.financiera}/>
              <br></br>  
            </div>
       </div> 
       <div className="row justify-content-center">
          <div className='col-md-2'>
            <button type="submit" className="btn btn-dark"> {isSubmitting ? "Enviandoo....." : "Enviar Orden"}</button>
          </div>
       </div>     
   </Form>
 </div>
  </>

  )}   
  </Formik>
  )
}

export default FormularioOrden