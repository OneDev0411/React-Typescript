import { types } from '../../store_actions/contact'
import _ from 'underscore'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.GET_CONTACTS:
      return _.indexBy(action.contacts, 'id')

    default:
      return state
  }
}
