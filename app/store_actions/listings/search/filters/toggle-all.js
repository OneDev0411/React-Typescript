import { change } from 'redux-form'

const formName = 'filters'

const toggleAll = (fieldName, properties, checked) => dispatch => {
  const value = checked ? properties : null

  dispatch(change(formName, fieldName, value))
}

export default toggleAll
