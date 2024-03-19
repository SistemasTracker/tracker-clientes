import axios from 'axios'; 
const url = "https://tracker-clientes.onrender.com/";
//const url = "http://localhost:3001/";


export const getOrden = async(token)=> 
    await axios.get(url+'ordenes',{headers:{'Authorization': `${token}`}})
    

export const authLogin = async (login) =>   
   await axios.post(url+'auth', login)


export const crearOrden = async (orden) =>
    await axios.post(url+'orden', orden)


export const getOrdenId = async (id,token) =>
    await axios.get(url+`orden/${id}`, {headers:{'Authorization': `${token}`}})


export const getOrdenUserId = async (id,token) =>
    await axios.get(url+`ordenes/${id}`, {headers:{'Authorization': `${token}`}})


export const getUsuarios = async (token) =>
    await axios.get(url+'users', {headers:{'Authorization': `${token}`}})


export const deleteEstado = async (id,token) =>
    await axios.delete(url+`orden/${id}`, {headers:{'Authorization': `${token}`}})


export const updateEstado = async (estado,id,token) =>
    await axios.patch(url+`orden/${id}`, {estado:estado} ,{ headers:{'Authorization':`${token}`}})


export const updateInstalado = async (instalado,id,token) =>
    await axios.patch(url+`instalado/${id}`, {instalado:instalado} ,{ headers:{'Authorization':`${token}`}})
    

export const updateCredenciales = async (credenciales,id,token) =>
    await axios.patch(url+`credenciales/${id}`, {credenciales:credenciales} ,{ headers:{'Authorization':`${token}`}})

    
export const updateOrden = async (id,orden) =>
    await axios.put(url+`orden/${id}`, orden)


export const postNovedad = async (novedad) =>
    await axios.post(url+`novedad`, {novedad : novedad})

    
export const getNovedades = async () =>
    await axios.get(url+`novedad`)


export const postBitacora = async (bitacora) =>
    await axios.post(url+`bitacora`, bitacora)

    
export const getBitacoras = async (id) =>
    await axios.get(url+`bitacora/${id}`)


export const getDeviceImei = async (id, token) =>
    await axios.get(url+`deviceImei/${id}`, {headers:{'Authorization': `${token}`}})


export const getUserEmail = async (id, token) =>
    await axios.get(url+`userEmail/${id}`, {headers:{'Authorization': `${token}`}})


export const getUserID = async (id, token) =>
    await axios.get(url+`userID/${id}`, {headers:{'Authorization': `${token}`}})


export const postMantenimiento = async (mantenimiento, token) =>
    await axios.post(url+`observacion`,  mantenimiento,  {headers:{'Authorization': `${token}`}})


export const getMantenimientos = async (id, token) =>
    await axios.get(url+`observacion/${id}`,  {headers:{'Authorization': `${token}`}})


export const postObservacionEliminarOrden = async (solisitud, token) =>
    await axios.post(url+`eliminarOrden`,  solisitud,  {headers:{'Authorization': `${token}`}})