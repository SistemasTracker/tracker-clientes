import React, { useState } from 'react';
import { Container, TextField, Button, Grid, MenuItem, Typography } from '@mui/material';

const grupos = [
  'Grupo 1',
  'Grupo 2',
  'Grupo 3',
  // Agrega aquí más opciones de grupos si es necesario
];

function DevicePage() {
  const [formData, setFormData] = useState({
    nombre: '',
    imei: '',
    numeroChip: '',
    contacto: '',
    fechaInicioContrato: '',
    fechaFinContrato: '',
    fechaRecarga: '',
    valorRecarga: '',
    grupo: '',
    chasis: '',
    modelo: '',
    placa: '',
    color: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    //console.log(formData);
  };

  return (
    <Container style={{ overflow: 'auto', marginTop: '10px' }}>
      <Typography variant="h6" gutterBottom>
        DATOS DEL DISPOSITIVO
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={0.5}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6} >
            <TextField
              fullWidth
              label="Imei"
              name="imei"
              value={formData.imei}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Número de Chip"
              name="numeroChip"
              value={formData.numeroChip}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contacto"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Fecha de Inicio de Contrato"
              type="date"
              name="fechaInicioContrato"
              value={formData.fechaInicioContrato}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Fecha de Fin de Contrato"
              type="date"
              name="fechaFinContrato"
              value={formData.fechaFinContrato}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Fecha de Recarga"
              type="date"
              name="fechaRecarga"
              value={formData.fechaRecarga}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Valor de la Recarga"
              name="valorRecarga"
              value={formData.valorRecarga}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Grupo"
              name="grupo"
              value={formData.grupo}
              onChange={handleChange}
              required
            >
              {grupos.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Chasis"
              name="chasis"
              value={formData.chasis}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Placa"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
        <br/>
        <Button variant="contained" color="primary" type="submit">
          Enviar
        </Button>
      </form>
    </Container>
  );
}

export default DevicePage;






