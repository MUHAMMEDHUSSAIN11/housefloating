'use client';

import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for Leaflet default icon not appearing in Next.js
L.Icon.Default.mergeOptions({
  iconUrl: typeof markerIcon === 'string' ? markerIcon : markerIcon.src,
  iconRetinaUrl: typeof markerIcon2x === 'string' ? markerIcon2x : markerIcon2x.src,
  shadowUrl: typeof markerShadow === 'string' ? markerShadow : markerShadow.src,
});

interface MapProps {
  center?: number[]
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map: React.FC<MapProps> = ({ center }) => {
  return (
    <MapContainer
      center={center as L.LatLngExpression || [51, -0.09]}
      zoom={center ? 8 : 4}
      scrollWheelZoom={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      zoomControl={false}
      className="h-[35vh] rounded-lg"
    >
      <TileLayer
        url={url}
        attribution={attribution}
      />
      {center && (
        <Marker position={center as L.LatLngExpression} />
      )}
    </MapContainer>
  )
}

export default Map