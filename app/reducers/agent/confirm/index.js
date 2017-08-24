import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

const confirm = combineReducers({
  form: reduxFormReducer
})

export default confirm
