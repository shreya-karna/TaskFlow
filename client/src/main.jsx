import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
document.documentElement.dataset.theme = localStorage.getItem('tf_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
