import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function tagsFetched(tags) {
  return {
    type: types.GET_TAGS,
    tags
  }
}

export function getTags() {
  return async (dispatch) => {
    const response = await Contact.getTags()
    const tags = _.indexBy(response.body.data, 'tag')
    dispatch(tagsFetched(tags))
  }
}
