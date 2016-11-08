// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import Routes from './routes'
import './index.scss'
import AppState from './components/App/AppState'
import { Provider } from 'mobx-react'
const data = new AppState()

ReactDOM.render(
  <Provider data={data}>
    <Routes history={browserHistory} />
  </Provider>,
  document.getElementById('root')
)