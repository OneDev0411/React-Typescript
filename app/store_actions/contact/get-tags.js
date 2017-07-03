import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function getTags (tags) {
  return {
    type: types.GET_TAGS,
    tags
  }
}

export default function () {
  return async (dispatch) => {
    const response = await Contact.getTags()
    const tags = _.indexBy(response.body.data, 'tag')
    dispatch(getTags(tags))
  }
}
