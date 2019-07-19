import React from 'react'
import ReactDOM from 'react-dom'
import Provider from './provider'

const rootEl = document.getElementById('app')

ReactDOM.render(<Provider />, rootEl)

if (window != null) {
  window.isSet = object => typeof object !== 'undefined'
}