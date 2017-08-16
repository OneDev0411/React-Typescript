import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

const resetPassword = combineReducers({
  form: reduxFormReducer
})

export default resetPassword
