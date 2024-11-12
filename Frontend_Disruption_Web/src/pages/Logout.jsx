import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('userProfile');
        // Redirect to login page
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} style={styles.button}>
            Logout
        </button>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px',
    }
};

export default LogoutButton;
