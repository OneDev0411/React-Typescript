import { applyMiddleware, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { enableBatching } from 'redux-batched-actions'
import thunk from 'redux-thunk'

import reducers from '../reducers'

const __DEV__ = process.env.NODE_ENV !== 'production'
const composer = __DEV__ ? composeWithDevTools : compose

const store = createStore(
  enableBatching(reducers),
  {},
  composer(applyMiddleware(thunk))
)

if (__DEV__ && module.hot) {
  module.hot.accept('../reducers', () => {
    store.replaceReducer(require('../reducers').default)
  })
}

export default store
