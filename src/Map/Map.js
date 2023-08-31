/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


function Map({currentPosition}) {
    const mapContainerRef = useRef(null);
    let marker;

    const styleCustom = ({ tiles, minZoom, maxZoom, attribution }) => {
      const source = {
        type: 'raster',
        tiles,
        attribution,
        tileSize: 256,
        minzoom: minZoom,
        maxzoom: maxZoom,
      };
      Object.keys(source).forEach((key) => source[key] === undefined && delete source[key]);
      return {
        version: 8,
        sources: {
          custom: source,
        },
        glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
        layers: [{
          id: 'custom',
          type: 'raster',
          source: 'custom',
        }],
      };
    };


    useEffect(() => {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: styleCustom({
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        }),
        center: currentPosition, // Establecer el centro directamente aquí
        zoom: 16, // Establecer el nivel de zoom inicial aquí
      });
  
      marker = new maplibregl.Marker()
        .setLngLat(currentPosition)
        .addTo(map);
  
      // Limpia el mapa al desmontar el componente.
      return () => map.remove();
    }, [currentPosition]);
  
    return <div ref={mapContainerRef} style={{ height: '85vh', marginTop: '5%'}} />;
  }
  
  export default Map;