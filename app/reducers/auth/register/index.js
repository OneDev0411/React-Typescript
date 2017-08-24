import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

const register = combineReducers({
  form: reduxFormReducer
})

export default register
