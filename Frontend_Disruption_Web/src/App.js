import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import '../src/css/style.css';
import ArticleDetail from './components/ArticleDetail';
import FilteredArticles from './pages/FilteredArticles';
import HomePage from './pages/HomePage';
import Login from './pages/LoginPage';
import LogoutButton from './pages/Logout';
import PreferencePage from './pages/PreferencePage.jsx';
import Register from './pages/RegisterPage.jsx';

function App() {
    const location = useLocation();

    useEffect(() => {
        document.querySelector('html').style.scrollBehavior = 'auto'
        window.scroll({ top: 0 })
        document.querySelector('html').style.scrollBehavior = ''
    }, [location.pathname]);

    return (
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<LogoutButton />} />
                    <Route path="/homepage" element={<HomePage />} />
                    <Route path="/preferences" element={<PreferencePage />} />
                    <Route path="/article/:id" element={<ArticleDetail />} />
                    <Route path="/filtered-articles" element={<FilteredArticles />} />
                </Routes>
            </div>
    );
};

export default App;
