import React from 'react';
import { useMap } from 'react-leaflet';

const MapUpdater = ({ selectedCity, selectedSupplier, selectedArticle, zoom }) => {
    const map = useMap();

    React.useEffect(() => {
        if (map) {
            if (selectedArticle && selectedArticle.lat && selectedArticle.lng) {

                map.setView([selectedArticle.lat, selectedArticle.lng], zoom);
            } else if (selectedSupplier && selectedSupplier.lat && selectedSupplier.lng) {

                map.setView([selectedSupplier.lat, selectedSupplier.lng], zoom);
            } else if (selectedCity && selectedCity.latitude && selectedCity.longitude) {

                map.setView([selectedCity.latitude, selectedCity.longitude], zoom);
            }
        }
    }, [selectedCity, selectedSupplier, selectedArticle, zoom, map]);

    return null;
};

export default MapUpdater;
