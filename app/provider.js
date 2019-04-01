import React from 'react'
import { Provider } from 'react-redux'

import App from './app'

// store
import store from './stores'

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
