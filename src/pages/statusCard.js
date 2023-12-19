import React, { useState } from 'react';
import {
    CardActions,
    IconButton,
    Paper,
    Snackbar,
} from '@mui/material';

import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
// import PublishIcon from '@mui/icons-material/Publish';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import { useLocation } from 'react-router-dom';

// import { snackBarDurationLongMs } from '../util/duration';

const StatusCard = ({ device, estate, position }) => {
    const location = useLocation();
    const estado = estate;

    const [open, setOpen] = useState(false);
    const token = location.state.token;

    let chip = '';
    let es130 = '';
    if (device != null) {
        chip = device.phone;
        es130 = device.attributes.isFMB130;
    }

    let url = 'https://tracker.com.ec/api/commands/send';
    let url1 = 'https://tracker-clientes.onrender.com/soapReq';

    const handleLock = async () => {
        let newComando;

        if (estado === 'offline') {
            if (es130) {
                newComando = '  setdigout 01';
            } else {
                newComando = '  setdigout 1';
            }
        } else {
            if (es130) {
                newComando = 'setdigout 01';
            } else {
                newComando = 'setdigout 1';
            }
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deviceId: device.id, type: 'custom', attributes: { data: newComando } }),
        };

        const requestOptions1 = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ numero: chip, usuario: 11, mensaje: newComando }),
        };

        try {
            if (estado === 'offline') {
                await fetch(url1, requestOptions1);
            } else {
                await fetch(url, requestOptions);
            }
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 2500);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleUnLock = async () => {
        let newComando;

        if (estado === 'offline') {
            if (es130) {
                newComando = "  setdigout 00";
            } else {
                newComando = "  setdigout 0";
            }
        } else {
            if (es130) {
                newComando = "setdigout 00";
            } else {
                newComando = "setdigout 0";
            }
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deviceId: device.id, type: 'custom', attributes: { data: newComando } }),
        };

        const requestOptions1 = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ numero: chip, usuario: 11, mensaje: newComando }),
        };

        try {
            if (estado === 'offline') {
                await fetch(url1, requestOptions1);
            } else {
                await fetch(url, requestOptions);
            }
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 2500);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdatePosition = async () => {
        let newComando;
        if (estado === 'offline') {
            newComando = "  getrecord";
        } else {
            newComando = "getrecord";
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deviceId: device.id, type: 'custom', attributes: { data: newComando } }),
        };

        const requestOptions1 = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ numero: chip, usuario: 11, mensaje: newComando }),
        };

        try {
            if (estado === 'offline') {
                await fetch(url1, requestOptions1);
            } else {
                await fetch(url, requestOptions);
            }
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 2500);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAbrirPuertas = async () => {
        let newComando;
        if (estado === 'offline') {
            newComando = "  setdigout 1? 5";

        } else {
            newComando = "setdigout 1? 5";
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deviceId: device.id, type: 'custom', attributes: { data: newComando } }),
        };

        const requestOptions1 = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ numero: chip, usuario: 11, mensaje: newComando }),
        };

        try {
            if (estado === 'offline') {
                await fetch(url1, requestOptions1);
            } else {
                await fetch(url, requestOptions);
            }
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 2500);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const googleMaps = (position) => {
        const link = `https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`;
        window.open(link, '_blank');
    }

    return (
        <>
            <div>
                {device && (
                    <Paper Paper elevation={3} style={{
                        position: 'absolute',
                        top: '8%',
                        left: '20px',
                        padding: '0px',
                        zIndex: 1000, // Ensure it's above the map
                    }}>
                        <CardActions disableSpacing>
                            <IconButton
                                onClick={() => handleLock()}
                            >
                                <LockIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleUnLock()}
                            >
                                <LockOpenIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleUpdatePosition()}
                            >
                                <AutorenewIcon />
                            </IconButton>
                            {es130 && (
                                <IconButton
                                    onClick={() => handleAbrirPuertas()}
                                >
                                    <VpnKeyOutlinedIcon />
                                </IconButton>
                            )}
                            <IconButton
                                onClick={() => googleMaps(position)}
                            >
                                <AssistantDirectionIcon />
                            </IconButton>
                        </CardActions>
                    </Paper>
                )}
            </div>
            <Snackbar
                open={open}
                message="COMANDO ENVIADO EXITOSAMENTE"
            />
        </>
    );
};

export default StatusCard;
