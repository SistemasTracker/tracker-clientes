import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SpeedIcon from '@mui/icons-material/Speed';
import BlockIcon from '@mui/icons-material/Block';
import PowerIcon from '@mui/icons-material/Power';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SignIconfrom from '@mui/icons-material/CellTower';

import moment from 'moment';


const FloatingPanel = ({ position, estado }) => {

    return (
        <Paper elevation={5} style={{
            position: 'absolute',
            bottom: '0px',
            padding: '10px',
          // Ensure it's above the map
        }}>
        <Grid container spacing={0.5} alignItems="center">
        <Grid item xs={2.3}>
            <SpeedIcon fontSize="large" />
            <Typography variant="subtitle1">Velocidad</Typography>
            <Typography variant="body2">{Math.round(position.speed * 1.85)} km/h</Typography>
        </Grid>
        <Grid item xs={2.3}>
            <BlockIcon fontSize="large" style={{color: position.attributes.blocked  === true ? 'green' : 'red'}} />
            <Typography variant="subtitle1">Bloqueado</Typography>
            <Typography variant="body2">{ position.attributes.blocked === true ? 'SI' : 'NO' }</Typography>
        </Grid>
        <Grid item xs={2.3}>
            <PowerIcon fontSize="large" style={{color: position.attributes.ignition === true ? 'green' : 'red'}}/>
            <Typography variant="subtitle1">Encendido</Typography>
            <Typography variant="body2">{position.attributes.ignition === true ? 'SI' : 'NO' }</Typography>
        </Grid>
        <Grid item xs={2.3}>
            <SignIconfrom fontSize="large" style={{color: estado  === 'online' ? 'green' : 'red'}}/>
            <Typography variant="subtitle1" >Estado</Typography>
            <Typography variant="body2" style={{color: estado  === 'online' ? 'green' : 'red'}}>{estado === 'online' ? 'En linea' : 'Fuera de linea'}</Typography>
        </Grid>
        <Grid item xs={2.3}>
            <ScheduleIcon fontSize="large" />
            <Typography variant="subtitle1">Hora</Typography>
            <Typography variant="body2">{moment(position.deviceTime).format('YYYY-MM-DD | HH:mm')}</Typography>
        </Grid>
        </Grid>
    </Paper>
    );
};

export default FloatingPanel;