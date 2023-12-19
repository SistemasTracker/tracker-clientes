import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SpeedIcon from '@mui/icons-material/Speed';
import BlockIcon from '@mui/icons-material/Block';
import PowerIcon from '@mui/icons-material/Power';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SignIconfrom from '@mui/icons-material/CellTower';
import AddressIcon from '@mui/icons-material/Map';

import moment from 'moment';


const FloatingPanel = ({ position, estado }) => {

    return (
        <Paper elevation={5} style={{
            position: 'absolute',
            bottom: '0px',
            padding: '5px',
          // Ensure it's above the map
        }}>
        <Grid container alignItems="center">
        <Grid item xs={2}>
            <SpeedIcon fontSize="medium" />
            <Typography variant="subtitle2">Velocidad</Typography>
            <Typography variant="body2">{Math.round(position.speed * 1.85)} km/h</Typography>
        </Grid>
        <Grid item xs={2}>
            <BlockIcon fontSize="medium" style={{color: position.attributes.blocked  === true ? 'green' : 'red'}} />
            <Typography variant="subtitle2">Bloqueado</Typography>
            <Typography variant="body2">{ position.attributes.blocked === true ? 'SI' : 'NO' }</Typography>
        </Grid>
        <Grid item xs={2}>
            <PowerIcon fontSize="medium" style={{color: position.attributes.ignition === true ? 'green' : 'red'}}/>
            <Typography variant="subtitle2">Encendido</Typography>
            <Typography variant="body2">{position.attributes.ignition === true ? 'SI' : 'NO' }</Typography>
        </Grid>
        <Grid item xs={2}>
            <SignIconfrom fontSize="medium" style={{color: estado  === 'online' ? 'green' : 'red'}}/>
            <Typography variant="subtitle2" >Estado</Typography>
            <Typography variant="body2" style={{color: estado  === 'online' ? 'green' : 'red'}}>{estado === 'online' ? 'En linea' : 'Fuera de linea'}</Typography>
        </Grid>
        <Grid item xs={2}>
            <ScheduleIcon fontSize="medium" />
            <Typography variant="body2">{moment(position.deviceTime).format('YYYY-MM-DD | HH:mm')}</Typography>
        </Grid>
        <Grid item xs={2}>
            <AddressIcon fontSize="medium" />
            <Typography variant="body2">{position.address}</Typography>
        </Grid>
        </Grid>
    </Paper>
    );
};

export default FloatingPanel;