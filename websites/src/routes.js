// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App';
import Templates from './components/Templates';
import EagerSeller from './components/Templates/EagerSeller';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/templates" component={Templates} />
    <Route path="/templates/eager-seller" component={EagerSeller} />
  </Router>
);

export default Routes;