import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Remove default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Define a custom icon for the supplier
const supplierIcon = new L.Icon({
    iconUrl: '/img/store.png',
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Define a default icon for the city
const cityIcon = new L.Icon({
    iconUrl: '/img/pin.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const MapComponent = ({ markers = [], zoom = 2, center }) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "calc(100vh - 200px)", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
                {markers.map((marker, index) => (
                    marker.type === 'article' ? (
                        <Circle
                            key={index}
                            center={[marker.lat, marker.lng]}
                            radius={marker.radius || 1000}
                            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}
                        >
                            <Popup>
                                <div>
                                    <h3>{marker.title}</h3>
                                    <p>{marker.details}</p>
                                    <a href={marker.url || '#'} target="_blank" rel="noopener noreferrer">Read more</a>
                                </div>
                            </Popup>
                        </Circle>
                    ) : marker.type === 'supplier' ? (
                        <Marker
                            key={index}
                            position={[marker.lat, marker.lng]}
                            icon={supplierIcon}
                        >
                            <Popup>
                                <div>
                                    <h3>{marker.title}</h3>
                                    <p>{marker.details}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ) : marker.type === 'city' ? (
                        <Marker
                            key={index}
                            position={[marker.lat, marker.lng]}
                            icon={cityIcon}
                        >
                            <Popup>
                                <div>
                                    <h3>{marker.title}</h3>
                                    <p>{marker.details}</p> 
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

export default MapComponent;
