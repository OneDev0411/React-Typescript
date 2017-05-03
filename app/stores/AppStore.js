import store from '.'
import { updateApp } from '../store_actions/data'

// hack Flux store to use Redux reducers
export default {
  data: store.getState().data,
  emitChange() {
    store.dispatch(updateApp(this.data))
  }
}
