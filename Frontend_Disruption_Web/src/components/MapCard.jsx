import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/components/MapCard.css';
import MapComponent from './MapComponents';

const API_BASE_URL = "http://18.141.34.124:7043/api";

const MapCard = () => {
  const [cities, setCities] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [citiesResponse, suppliersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/cities`),
        axios.get(`${API_BASE_URL}/suppliers`)
      ]);
      setCities(citiesResponse.data.$values || []);
      setSuppliers(suppliersResponse.data.$values || []);
    };

    fetchData();
  }, []);

  return (
    <div>
      <MapComponent
        zoom={mapZoom}
        center={mapCenter} // Pusat peta tidak akan berubah secara otomatis
        markers={[
          ...cities.map(city => ({
            lat: city.latitude,
            lng: city.longitude,
            title: city.location,
            type: 'city'
          })),
          ...suppliers.map(supplier => ({
            lat: supplier.lat,
            lng: supplier.lng,
            title: supplier.bP_Name,
            type: 'supplier'
          }))
        ]}
      />
    </div>
  );
};

export default MapCard;
