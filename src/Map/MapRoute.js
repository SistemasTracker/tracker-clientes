/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { blue } from '@mui/material/colors';

const MapWithRoute = ({ posiciones, posicionSelected }) => {
  const [map, setMap] = useState(null);
  const mapContainerRef = useRef(null);

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

  const createMap = (coordinates) => {
    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleCustom({
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      }),
      center: coordinates[0],
      zoom: 16,
    });

    mapInstance.on('load', () => {
      mapInstance.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      });

      mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': blue[500],
          'line-width': 3,
        },
      });

      const bounds = coordinates.reduce(
        (acc, coord) => acc.extend(coord),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );
      mapInstance.fitBounds(bounds, { padding: 20 });
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
      setMap(null);
    };
  };

  const agregarMarcador = (posicion) => {
    if (map) {
      const markerSource = map.getSource('marker-source');
      if (markerSource) {
        map.removeLayer('marker');
        markerSource.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [posicion.longitude, posicion.latitude],
          },
        });
      } else {
        map.addSource('marker-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [posicion.longitude, posicion.latitude],
            },
          },
        });
      }

      map.addLayer({
        id: 'marker',
        type: 'circle',
        source: 'marker-source',
        paint: {
          'circle-radius': 10,
          'circle-color': '#666666',
        },
      });

      map.flyTo({
        center: [posicion.longitude, posicion.latitude],
        zoom: 16,
      });
    }
  };

  useEffect(() => {
    const routeCoordinates = posiciones.map(posicion => [posicion.longitude, posicion.latitude]);
    const cleanupMap = createMap(routeCoordinates);

    return () => {
      if (cleanupMap) cleanupMap();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posiciones]);

  useEffect(() => {
    agregarMarcador(posicionSelected);
  }, [posicionSelected, map]);

  return <div ref={mapContainerRef} style={{ height: '40vh', marginTop: '1%' }} />;
};

export default MapWithRoute;
