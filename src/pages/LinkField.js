/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';


const LinkField = ({
  label,
  endpointAll,
  endpointLinked,
  token,
  url,
  email,
  password,
  baseId,
  keyBase,
  keyLink,
  keyGetter = (item) => item.id,
  titleGetter = (item) => item.name,
}) => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState();
  const [linked, setLinked] = useState();

  
  useEffect(() => {
    // Definir una función asíncrona dentro de useEffect
    const fetchData = async () => {
      try {
        console.log(endpointAll);
        if (active) {
          const response = await fetch(endpointAll, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setItems(data);
            console.log(data);
          } else {
            throw Error(await response.text());
          }
        }
      } catch (error) {
        // Manejar errores si es necesario
        console.error(error);
      }
    };
  
    // Llamar a la función asíncrona inmediatamente
    fetchData();
  }, [active]);

  useEffect(() => {
    // Definir una función asíncrona dentro de useEffect
    const fetchData1 = async () => {
      try {
        if (active) {
          const response = await fetch(endpointLinked, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setLinked(data);
          } else {
            throw Error(await response.text());
          }
        }
      } catch (error) {
        // Manejar errores si es necesario
        console.error(error);
      }
    };
  
    // Llamar a la función asíncrona inmediatamente
    fetchData1();
  }, [active]);

  const createBody = (linkId) => {
    const body = {};
    body[keyBase] = baseId;
    body[keyLink] = linkId;
    return body;
  };

  const onChange = async (value) => {
    const oldValue = linked.map((it) => keyGetter(it));
    const newValue = value.map((it) => keyGetter(it));
    if (!newValue.find((it) => it < 0)) {
      const results = [];
      newValue.filter((it) => !oldValue.includes(it)).forEach((added) => {
        results.push(fetch(`${url}/api/permissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` },
          body: JSON.stringify(createBody(added)),
        }));
      });
      oldValue.filter((it) => !newValue.includes(it)).forEach((removed) => {
        results.push(fetch(`${url}/api/permissions`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`},
          body: JSON.stringify(createBody(removed)),
        }));
      });
      await Promise.all(results);
      setLinked(value);
    }
  };

  return (
    <Autocomplete
    style={{
        marginTop: '20px'
      }}
      loading={active && !items}
      isOptionEqualToValue={(i1, i2) => keyGetter(i1) === keyGetter(i2)}
      options={items || []}
      getOptionLabel={(item) => titleGetter(item)}
      renderInput={(params) => <TextField {...params} label={label} />}
      value={(items && linked) || []}
      onChange={(_, value) => onChange(value)}
      open={open}
      onOpen={() => {
        setOpen(true);
        setActive(true);
      }}
      onClose={() => setOpen(false)}
      multiple
    />
  );
};

export default LinkField;
