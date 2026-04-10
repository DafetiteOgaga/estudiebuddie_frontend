import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import { ConfirmProvider } from './contexts/overlayContext';
import { DeviceProvider } from './contexts/deviceTypeContext';
import { LogoProvider } from './contexts/LogoContext';
import 'mathlive';

const root = ReactDOM.createRoot(document.getElementById('root'));

// automatically detect github-pages environment and use HashRouter in that case
const isGitHubPages = window.location.hostname.includes('github.io');
const RouterToUse = isGitHubPages ? HashRouter : BrowserRouter;
root.render(
  // <React.StrictMode>
  <LogoProvider>
    <DeviceProvider>
      <ConfirmProvider>
        <AuthProvider>
          <RouterToUse>
            <App />
          </RouterToUse>
        </AuthProvider>
      </ConfirmProvider>
    </DeviceProvider>
  </LogoProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
