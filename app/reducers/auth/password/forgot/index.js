import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

const forgotPassword = combineReducers({
  form: reduxFormReducer
})

export default forgotPassword
