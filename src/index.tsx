import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.scss';
import * as serviceWorker from './serviceWorker';
import { App } from './App';
import { ParticleSystem } from './App/ps';

ReactDOM.render(
  <React.StrictMode>
    <App GL_App={ParticleSystem} />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
