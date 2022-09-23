import { Provider } from 'react-redux'

// eslint-disable-next-line import/order
import App from './app'

// store
import store from './stores'

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
