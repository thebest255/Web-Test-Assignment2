import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Search from './search';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const appHeight: Function = (): void => {
  const doc: HTMLElement = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
}

if (typeof window !== "undefined") {
  window.addEventListener('resize', () => appHeight());
  appHeight();
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route index element={<App />} />
        <Route path=':login' element={<Search />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);