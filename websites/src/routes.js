// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';
var Template = require('./components/Templates/' + process.env.TEMPLATE_NAME);

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Template} />
  </Router>
);

export default Routes;