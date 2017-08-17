import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

const signup = combineReducers({
  form: reduxFormReducer
})

export default signup
