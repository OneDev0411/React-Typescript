import { applyMiddleware, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import reducers from '../reducers'

const __DEV__ = process.env.NODE_ENV !== 'production'
const composer = __DEV__ ? composeWithDevTools : compose

const initialState = typeof window !== 'undefined' && window.__APPLICATION_STATE__ ?
  JSON.parse(decodeURIComponent(window.__APPLICATION_STATE__)) :
  {}

const store = createStore(reducers, initialState, composer(
  applyMiddleware(thunk)
))

if (__DEV__ && module.hot) {
  module.hot.accept('../reducers', () => {
    store.replaceReducer(require('../reducers').default)
  })
}

export default store
