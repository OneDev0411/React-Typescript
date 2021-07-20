import { change } from 'redux-form'

const formName = 'filters'

const toggleSubStatuses = (fields, nextState) => dispatch => {
  Object.keys(fields).forEach(status => {
    const value = nextState ? fields[status] : null

    dispatch(change(formName, `listing_statuses.${status}`, value))
  })
}

export default toggleSubStatuses
