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
import NetworkClient from '@common/src/services/NetworkClient';
import Container from 'typedi';
import Configuration from './context/ConfigContext';

function configOptions(str: string) {
  return parseKVFormat(str)
    .filter(at(0).when(matches(/^REACT_APP_/)))
    .reduce(asTable, config as Record<string, string | number | boolean>);
}

axios
  .get<string>('/conf.env')
  .then(extracting('data', configOptions))
  .then(() => Container.get(NetworkClient).causes.get('causes/config'))
  .then(({ data: causes }) => {
    const config = new Configuration(causes.percentages.cause);
    ReactDOM.render(
      <React.StrictMode>
        <BrowserRouter>
          <App config={config} />
        </BrowserRouter>
      </React.StrictMode>,
      document.getElementById('root')
    );
    reportWebVitals();
  });
