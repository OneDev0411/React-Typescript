import React from 'react';
import ReactDOM from 'react-dom';
import Templates from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Templates />, div);
});
