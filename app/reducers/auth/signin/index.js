import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

const signin = combineReducers({
  form: reduxFormReducer
})

export default signin
