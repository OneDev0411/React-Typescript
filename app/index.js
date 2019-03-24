import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const rootEl = document.getElementById('app')

ReactDOM.render(<App />, rootEl)

if (window != null) {
  window.isSet = object => typeof object !== 'undefined'
}