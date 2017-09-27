import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './app'

const rootEl = document.getElementById('app')

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
)

if (window != null) {
  window.isSet = object => typeof object !== 'undefined'
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app', () => {
    ReactDOM.render(
      <AppContainer>
        <App key={Math.random()} />
      </AppContainer>,
      rootEl
    )
    console.clear()
  })
}
