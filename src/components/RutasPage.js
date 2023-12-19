import React, { useState } from 'react';


// Asegúrate de que moment.js esté instalado


const RutasPage = ({ uniqueid, token }) => {
  const url = 'https://tracker.com.ec';

  const obtenerRutas = async () => {
    console.log(uniqueid);
    try {
      const response = await fetch(`${url}/api/reports/route`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uniqueid)
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
}

  return (
    <>

    </>
    )
};

export default RutasPage;
