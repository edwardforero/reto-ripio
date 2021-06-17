import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from "@material-ui/core/CssBaseline";

ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <CssBaseline/>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
