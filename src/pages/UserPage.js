import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from '@mui/material';
import moment from 'moment';
import { Button } from 'react-bootstrap-v5';
import LinkField from './LinkField';

// Asegúrate de que moment.js esté instalado


const UserPage = ({ user, setUser, opcion, token }) => {
  const url = 'https://tracker.com.ec';
  const [open, setOpen] = useState(false);
  const formatAlarm = (value) => (value ? prefixString('alarm', value) : '');
  const prefixString = (prefix, value) => prefix + value.charAt(0).toUpperCase() + value.slice(1);
  
  const formatNotificationTitle = (notification, includeId) => {
    let title = prefixString('event', notification.type);
    if (notification.type === 'alarm') {
      const alarmString = notification.attributes.alarms;
      if (alarmString) {
        const alarms = alarmString.split(',');
        if (alarms.length > 1) {
          title += ` (${alarms.length})`;
        } else {
          title += ` ${formatAlarm(alarms[0])}`;
        }
      }
    }
    if (includeId) {
      title += ` [${notification.id}]`;
    }
    return title;
  };

  const crearUsuario = async () => {
    console.log(user);
    try {
      const response = await fetch(`${url}/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      console.log(response);
      if (response.status === 200) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const actualizarUsuario = async () => {
    console.log(user)
    try {
      const response = await fetch(`${url}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      console.log(response);
      if (response.status === 200) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
      <Container style={{ border: '2px solid #000', overflow: 'auto', marginTop: '8px', height: '100%' }} >
        <div>
          <Container style={{ overflow: 'auto', marginTop: '10px' }}>
            <Typography variant="h6" gutterBottom>
              DATOS DEL USUARIO
            </Typography>
            <TextField
              value={user.name || ''}
              onChange={(event) => setUser({ ...user, name: event.target.value })}
              label='Nombre'
              style={{
                width: '32%',
              }}
            />
            <TextField
              value={user.email || ''}
              onChange={(event) => setUser({ ...user, email: event.target.value })}
              label='Email'
              style={{
                width: '32%',
                marginLeft: '10px'
              }}
            />
            {opcion === 1 && (<TextField
              type='password'
              onChange={(event) => setUser({ ...user, password: event.target.value })}
              label='Contraseña'
              style={{
                width: '32%',
                marginLeft: '10px'
              }}
            />)}
            <Accordion style={{ marginTop: '10px' }} defaultExpanded>
              <AccordionSummary>
                <Typography variant="subtitle1">
                  Permisos
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label='Fecha de Caducidad'
                  type="date"
                  style={{
                    width: '32%',
                    marginTop: '10px'
                  }}
                  value={(user.expirationTime && moment(user.expirationTime).locale('en').format(moment.HTML5_FMT.DATE)) || '2099-01-01'}
                  onChange={(e) => setUser({ ...user, expirationTime: moment(e.target.value, moment.HTML5_FMT.DATE).locale('en').format() })}
                />
                <TextField
                  type="number"
                  style={{
                    width: '32%',
                    marginTop: '10px',
                    marginLeft: '10px'
                  }}
                  value={user.deviceLimit || 0}
                  onChange={(e) => setUser({ ...user, deviceLimit: Number(e.target.value) })}
                  label='Limite de dispositivos'
                />
                <TextField
                  type="number"
                  style={{
                    width: '32%',
                    marginTop: '10px',
                    marginLeft: '10px'
                  }}
                  value={user.userLimit || 0}
                  onChange={(e) => setUser({ ...user, userLimit: Number(e.target.value) })}
                  label='Limite de Usuarios'
                />
                {user.id && (<FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={user.disabled} onChange={(e) => setUser({ ...user, disabled: e.target.checked })} />}
                    label='Deshabilitado'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={user.administrator} onChange={(e) => setUser({ ...user, administrator: e.target.checked })} />}
                    label='Administrador'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={user.readonly} onChange={(e) => setUser({ ...user, readonly: e.target.checked })} />}
                    label='Solo lectura'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={user.deviceReadonly} onChange={(e) => setUser({ ...user, deviceReadonly: e.target.checked })} />}
                    label='Dispositivo de solo lectura'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={user.limitCommands} onChange={(e) => setUser({ ...user, limitCommands: e.target.checked })} />}
                    label='Limitar comandos'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={user.disableReports} onChange={(e) => setUser({ ...user, disableReports: e.target.checked })} />}
                    label='Deshabilitar reportes'
                  />
                </FormGroup>)}
              </AccordionDetails>
            </Accordion>
            <TextField
              value={user.celular || ''}
              onChange={(event) => setUser({ ...user, celular: event.target.value })}
              label="Celular"
              style={{
                width: '32%',
                marginTop: '10px',
                marginLeft: '10px'
              }}
            />
            <TextField
              value={user.direccion || ''}
              onChange={(event) => setUser({ ...user, direccion: event.target.value })}
              label="Direccion"
              style={{
                width: '32%',
                marginTop: '10px',
                marginLeft: '10px'
              }}
            />
            <TextField
              value={user.ciudad || ''}
              onChange={(event) => setUser({ ...user, ciudad: event.target.value })}
              label="Ciudad"
              style={{
                width: '32%',
                marginTop: '10px',
                marginLeft: '10px'
              }}
            />
            <TextField
              value={user.contactoe || ''}
              onChange={(event) => setUser({ ...user, contactoe: event.target.value })}
              label="Contacto Emergencia"
              style={{
                width: '32%',
                marginTop: '10px',
                marginLeft: '10px'
              }}
            />
            <TextField
              value={user.telefonoe || ''}
              onChange={(event) => setUser({ ...user, telefonoe: event.target.value })}
              label="Telefono Emergencia"
              style={{
                width: '32%',
                marginTop: '10px',
                marginLeft: '10px'
              }}
            />
              { user.id && (
              <Accordion defaultExpanded key={user.id}>
              <AccordionSummary>
                <Typography variant="subtitle1">
                  CONEXIONES
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LinkField
                  key={user.id}
                  endpointAll={`${url}/api/devices?all=true`}
                  endpointLinked={`${url}/api/devices?userId=${user.id}`}
                  baseId={user.id}
                  token={token}
                  url={url}
                  keyBase="userId"
                  keyLink="deviceId"
                  label='Dispositivos'
                />
                <LinkField
                  key={user.id}
                  endpointAll={`${url}/api/groups?all=true`}
                  endpointLinked={`${url}/api/groups?userId=${user.id}`}
                  baseId={user.id}
                  token={token}
                  url={url}
                  keyBase="userId"
                  keyLink="groupId"
                  label='Grupos'
                />
                <LinkField
                  key={user.id}
                  endpointAll={`${url}/api/notifications?all=true`}
                  endpointLinked={`${url}/api/notifications?userId=${user.id}`}
                  baseId={user.id}
                  token={token}
                  url={url}
                  keyBase="userId"
                  keyLink="notificationId"
                  titleGetter={(it) => formatNotificationTitle( it, true)}
                  label='Notificaciones'
                />
                <LinkField
                  key={user.id}
                  endpointAll={`${url}/api/attributes/computed?all=true`}
                  endpointLinked={`${url}/api/attributes/computed?userId=${user.id}`}
                  baseId={user.id}
                  token={token}
                  url={url}
                  keyBase="userId"
                  keyLink="attributeId"
                  titleGetter={(it) => it.description}
                  label='Atributos Calculados'
                />
              </AccordionDetails>
            </Accordion>) }
          </Container>
        </div>
        <Button
       className='btn btn-warning'
              style={{
                width: '32%',
                marginTop: '10px',
                marginLeft: '10px'
              }}
              variant="contained"
              onClick={() => {
                opcion === 1 ? crearUsuario() : actualizarUsuario()
              }}
            >
              {opcion === 1 ? 'CREAR USUARIO' : 'ACTUALIZAR USUARIO'}
            </Button>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        message="INGRESO EXITOSO"
      />
    </>
  );
};

export default UserPage;
