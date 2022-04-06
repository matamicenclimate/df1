import 'reflect-metadata';
import './service/impl';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import './styles/main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import config from '@/lib/config';

axios.get<string>('/conf.env').then((res) => {
  res.data
    .split('\n')
    .map((s) => s.match(/^([^=]+)=([^\n#]+)$/))
    .forEach((m) => {
      if (m != null) {
        if (m[1].match(/^REACT_APP_/)) {
          config[m[1]] = m[2];
        }
      }
    });
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
  reportWebVitals();
});
