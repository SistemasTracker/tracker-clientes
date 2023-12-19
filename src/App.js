import {  Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Login from "./pages/login.js";
import NotFound from './pages/NotFound';
import VerOrden from './pages/verOrden';
import FormularioOrdenCliente from './pages/formularioOrdenCliente';
import FormularioOrden from './pages/formularioOrden';
import Usuarios from './pages/usuarios';
import VerOrdenUser from './pages/verOrdenesUsuario';
import 'bootstrap/dist/js/bootstrap.bundle';
import EditarOrden from './pages/editarFormulario';
import Eventos from './pages/eventos';
import Login1 from './pages/login1';
import PruebasLogin from './pages/pruebasLogin';
import PruebasPage from './pages/pruebasPage';
import SubirEquipos from './pages/subirEquipos';
import UserPanel from './pages/panelUsuario.js';
import Reportpanel from './pages/panelReportes';





function App() {
  return (
    <Routes>
      <Route path='/' element={<Login></Login>}></Route>
      <Route path='/formulario' element={<FormularioOrden></FormularioOrden>}></Route>     
      <Route path='/orden' element={<VerOrden></VerOrden>}></Route>
      <Route path='/ordenuser' element={<VerOrdenUser></VerOrdenUser>}></Route>
      <Route path='/usuarios' element={<Usuarios></Usuarios>}></Route>
      <Route path='/editar' element={<EditarOrden></EditarOrden>}></Route>
      <Route path='/login1' element={<Login1></Login1>}></Route>
      <Route path='/pruebasLogin' element={<PruebasLogin></PruebasLogin>}></Route>
      <Route path='/eventos' element={<Eventos></Eventos>}></Route>
      <Route path='/pruebasPage' element={<PruebasPage></PruebasPage>}></Route>
      <Route path='/subirEquipos' element={<SubirEquipos></SubirEquipos>}></Route>
      <Route path='/usuariosPage' element={<UserPanel></UserPanel>}></Route>
      <Route path='/reportesPage' element={<Reportpanel></Reportpanel>}></Route>
      <Route path='*' element={<NotFound></NotFound>}></Route>
      <Route exact path='/formulariocliente' element={<FormularioOrdenCliente></FormularioOrdenCliente>}></Route>     
    </Routes>
  );
}

export default App;
