import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function getTags (tags) {
  return {
    type: types.GET_TAGS,
    tags
  }
}

export default function (user) {
  const params = {
    access_token: user.access_token
  }

  return async (dispatch) => {
    const response = await Contact.getTags(params)
    const tags = _.indexBy(response.body.data, 'tag')
    dispatch(getTags(tags))
  }
}
