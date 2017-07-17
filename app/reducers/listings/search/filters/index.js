import { combineReducers } from 'redux'
import isOpen from './isOpen'
import { reducer as reduxFormReducer } from 'redux-form'

const filters = combineReducers({
  isOpen,
  form: reduxFormReducer
})

export default filters
