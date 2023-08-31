import { useState } from 'react';

const initialState = {
  items: [],
};

const addEvent = (state, newEvent) => {
  const existingEvent = state.items.find(event => event.id === newEvent.id);
  if (existingEvent) {
    // El evento ya existe, puedes optar por no agregarlo o reemplazarlo
    // Ejemplo: no agregar eventos duplicados
    return state;
  }

  return {
    ...state,
    items: [newEvent, ...state.items],
  };
};

const deleteEvent = (state, deletedEvent) => {
  return {
    ...state,
    items: state.items.filter((item) => item.id !== deletedEvent.id),
  };
};

const deleteAllEvents = (state) => {
  return {
    ...state,
    items: [],
  };
};

const deleteAllEventsFromDevice = (state, deletedDeviceIds) => {
  return {
    ...state,
    items: state.items.filter((item) => !deletedDeviceIds.includes(item.id)),
  };
};

const EventsSlice = () => {
  const [state, setState] = useState(initialState);

  const eventsActions = {
    add: (newEvent) => {
      setState((prevState) => addEvent(prevState, newEvent));
    },
    delete: (deletedEvent) => {
      setState((prevState) => deleteEvent(prevState, deletedEvent));
    },
    deleteAll: () => {
      setState((prevState) => deleteAllEvents(prevState));
    },
    deleteAllFromDevice: (deletedDeviceIds) => {
      setState((prevState) => deleteAllEventsFromDevice(prevState, deletedDeviceIds));
    },
  };

  return {
    state: state,
    actions: eventsActions,
  };
};

export default EventsSlice;
