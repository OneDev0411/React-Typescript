import { applyMiddleware, createStore /* compose */ } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import reducers from '../reducers'

const __DEV__ = process.env.NODE_ENV !== 'production'
// const composer = __DEV__ ? composeWithDevTools : compose
const composer = composeWithDevTools

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
