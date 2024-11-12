import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponents';
import CitySearch from '../components/CitySearch';
import DatePicker from 'react-datepicker'; // Make sure to install this package
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker

const WorldMap = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedArticle, setArticleSelect] = useState(null);

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://18.141.34.124:7043/api/articles");
            const articles = response.data.$values || [];
            const sortedArticles = articles.sort((a, b) => b.id - a.id);
            setArticles(sortedArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('Failed to load articles. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchArticles();
    // }, []);

    const handleCitySelect = (city) => {
        setSelectedCity(city);
    };

    const handleSupplierSelect = (supplier) => {
        setSelectedSupplier(supplier);
    };

    const handleArticleSelect = (article) => {
        setArticleSelect(article)
    };

    const markers = useMemo(() =>
        articles
            .map((article) => ({
                lat: article.lat ?? null,
                lng: article.lng ?? null,
                radius: 1000,
                title: article.title || 'No Title',
                severity: article.severity,
                description: article.text || 'No description available.',
                disruptionType: article.disruptionType,
                publishedDate: article.publishedDate || 'No date available.',
                url: article.url || '#'
            }))
            .filter(marker => marker.lat !== null && marker.lng !== null),
        [articles]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <CitySearch
                onCitySelect={handleCitySelect}
                onSupplierSelect={handleSupplierSelect}
                onArticleSelect={handleArticleSelect}
            />

            <MapComponent
                markers={markers}
                zoom={2}
                selectedCity={selectedCity}
                selectedSupplier={selectedSupplier}
                selectedArticle={selectedArticle}
                center={[0, 0]}
            />
        </>
    );
};

export default WorldMap;
