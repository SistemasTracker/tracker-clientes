/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function Map({ currentPosition, device, mapType = 'streets' }) {
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
        tiles: mapType === 'satellite'
          ? ['https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga']
          : ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      }),
      center: currentPosition,
      zoom: 16,
    });

    marker = new maplibregl.Marker()
      .setLngLat(currentPosition)
      .addTo(map);

    var popup = new maplibregl.Popup({ closeButton: false })
      .setHTML(`<strong>${device.name || 'PRUEBA'}</strong>`)
      .addTo(map);

    marker.setPopup(popup);

    // Limpia el mapa al desmontar el componente.
    return () => map.remove();
  }, [currentPosition, mapType]);

  return <div ref={mapContainerRef} style={{ height: '85vh', marginTop: '5%' }} />;
}

export default Map;
