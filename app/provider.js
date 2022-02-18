import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Provider } from 'react-redux'

import config from 'config'

// eslint-disable-next-line import/order
import App from './app'

const stripePromise = loadStripe(config.stripe.public_key)

// store
import store from './stores'

export default () => (
  <Elements stripe={stripePromise}>
    <Provider store={store}>
      <App />
    </Provider>
  </Elements>
)
