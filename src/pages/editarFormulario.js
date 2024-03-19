import React from 'react';
import '../assets/css/formulario.css';
import {FaUserAlt,FaMapMarked,FaUserTie,FaPhone,FaEnvelope,FaRegBookmark,FaStore} from 'react-icons/fa';
import moment from 'moment';
import {Form, Formik} from 'formik';
//Naavegador de páginas
import {useLocation} from 'react-router-dom';
import { updateOrden } from '../services/apiRest.js';
//Guardar token
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
import jsPDF from 'jspdf';


function EditarOrden() {

  const location = useLocation();
  const idUsuario = location.state.idUsuario;
  console.log(idUsuario);
  const token = location.state.token;
  const orden = location.state.orden;
  console.log(orden);





  
return (

  <Formik initialValues={
    {
      fecha: moment(orden.fecha).locale('en').format(moment.HTML5_FMT.DATE),
      nombreCliente: orden.nombreCliente,
      vendedor: orden.vendedor,
      direccion:orden.direccion,
      telefono1:orden.telefono1,
      email:orden.email,
      nombreEmergencia:orden.nombreEmergencia,
      telefono2:orden.telefono2,
      correoEmergencia:orden.correoEmergencia,
      chasis:orden.chasis,
      motor:orden.motor,
      marca:orden.marca,
      modelo:orden.modelo,
      placa:orden.placa,
      color:orden.color,
      idusuario: idUsuario,
      plan:orden.plan,
      financiera:orden.financiera,
      anio:orden.anio,
      local:orden.local,
      valor:orden.valor,
      facturaNombre:orden.facturaNombre,
      ruc:orden.ruc,
      imei:orden.imei != null ? orden.imei : ' ',
      estado:orden.estado
    }
  }
  onSubmit={async (values, actions)=>{
    console.log(values);
    try {
        values.fecha = moment(values.fecha).locale('es').format();
        await updateOrden(orden.idordenTrabajo,values);
        console.log(values);  
        alert('FORMULARIO ACTUALIZADO EXITOSAMENTE');
              var plan1 = values.plan.toString();
              var valor1 = values.valor.toString();
              var imei1 = values.imei.toString();
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
              doc.text(40,70,'FECHA DE SOLICITUD:'); doc.text(200,70, moment(values.fecha).locale('en').format(moment.HTML5_FMT.DATE));
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
              doc.text(40,370,'PLAN:'); doc.text(200,370, plan1);
              doc.text(40,385,'VALOR $:'); doc.text(200,385, valor1);
              doc.text(40,400,'FINANCIERA:'); doc.text(200,400, values.financiera);
              doc.text(40,415,'FACTURA A NOMBRE DE:'); doc.text(200,415, values.facturaNombre);
              doc.text(40,430,'RUC/CI:'); doc.text(200,430, values.ruc);
              doc.setFont('Helvertica', 'bold');
              doc.setFillColor(238,201,47)
              doc.rect(35,440,370,13,'F')
              doc.text(40,450,'DATOS DEL DISPOSITIVO')
              doc.setFont('Helvertica', 'normal');
              doc.rect(35,455,370,30)
              doc.text(40,465,'IMEI:');doc.text(200,465, imei1);
              doc.line(35,470,405,470)
              doc.text(40,480,'CHIP:')
              doc.save('Activacion_'+values.nombreCliente+'.pdf');
            
              actions.resetForm({
                values: {
                  fecha: '',
                  nombreCliente: '',
                  vendedor: '',
                  direccion:'',
                  telefono1:'',
                  email:'',
                  nombreEmergencia:'',
                  telefono2:'',
                  correoEmergencia:'',
                  chasis:'',
                  motor:'',
                  marca:'',
                  modelo:'',
                  placa:'',
                  color:'',
                  idusuario: idUsuario,
                  plan:'',
                  financiera:'',
                  anio:'',
                  local:'',
                  valor:'',
                  facturaNombre:'',
                  ruc:'',
                  imei:'',
                  estado:orden.estado

              }});
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
    <img src={LOGO} alt="" width="30" height="24" className="d-inline-block align-text-top"/>
      TRACKER X
    </span>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <div className="navbar-nav">
          <Link className="nav-link" to={"/orden"} state={{token:token, idUsuario: idUsuario}}>Ordenes</Link>  
      </div>
      </ul>
    
    <form className="d-flex">
      <Link to={"/"} className="btn btn-outline-dark" type="submit">Cerrar Sesión</Link>
    </form>
    </div>
  </div>
</nav>
   <div className='container border border-3 p-5 my-5'>
    <h3 className='text-center'>EDITAR ORDEN DE ACTIVACIÓN</h3>
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
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaStore></FaStore> Local</label>
              <input type="label" className="form-control" name='local' onChange={handleChange} value={values.local}/>
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
              <label className="form-label fw-bold">Año</label>
              <input type="label" className="form-control" name='anio' onChange={handleChange} value={values.anio} required/>
            </div>
            <div className="col-md-4">
            <label className="form-label fw-bold">Placa</label>
              <input type="label" className="form-control" name='placa' onChange={handleChange} value={values.placa} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Chasis</label>
              <input type="label" className="form-control" name='chasis' onChange={handleChange} value={values.chasis} required/>
              
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Color</label>
              <input type="label" className="form-control" name='color' onChange={handleChange} value={values.color} required/>
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
              <label className="form-label fw-bold">AÑOS DE SERVICIO</label>              
              <input type="label" className="form-control" name='plan' onChange={handleChange} value={values.plan} required/>  
                   
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
            <div className="col-md-4">
              <label className="form-label fw-bold">IMEI</label>              
              <input type="label" className="form-control" name='imei' onChange={handleChange} value={values.imei}/>  
              <br></br>         
            </div>
       </div> 
       <div className="row justify-content-center">
          <div className='col-md-4'>
            <button type="submit" className="btn btn-dark" > {isSubmitting ? "Actualizando...." : "Actualizar y descargar Orden"}</button>
          </div>
       </div>     
   </Form>
 </div>
  </>

  )}   
  </Formik>
  )
}

export default EditarOrden