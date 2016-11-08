import React from 'react';
import ReactDOM from 'react-dom';
import EditBar from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EditBar />, div);
});
