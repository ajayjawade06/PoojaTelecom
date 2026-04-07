import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './redux/store.js';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
 <Provider store={store}>
 <HelmetProvider>
 <BrowserRouter>
 <App />
 </BrowserRouter>
 </HelmetProvider>
 </Provider>
);
