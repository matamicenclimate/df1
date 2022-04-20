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
import { asTable, at, extracting, matches, parseKVFormat } from '@common/src/lib/data';

function configOptions(str: string) {
  return parseKVFormat(str)
    .filter(at(0).when(matches(/^REACT_APP_/)))
    .reduce(asTable, config as Record<string, string | number | boolean>);
}

axios
  .get<string>('/conf.env')
  .then(extracting('data', configOptions))
  .then(() => {
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
