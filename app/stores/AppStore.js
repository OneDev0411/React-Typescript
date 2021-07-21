import { updateApp } from '../store_actions/data'

import store from '.'

// hack Flux store to use Redux reducers
export default {
  data: store.getState().data,
  emitChange() {
    store.dispatch(updateApp(this.data))
  }
}
