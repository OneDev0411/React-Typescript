import { types } from '../../store_actions/data'
const initialState = {
  counter: 1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_APP:
      const counter = !state.counter ? initialState.counter : state.counter + 1

      return {
        ...action.data,
        ...{counter}
      }

    default:
      return state
  }
}
