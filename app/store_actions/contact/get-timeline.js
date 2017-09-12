import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function getTimeline (id, timeline) {
  return {
    type: types.GET_TIMELINE,
    id,
    timeline
  }
}

export default function (id) {
  return async (dispatch) => {
    const response = await Contact.getTimeline(id)
    const timeline = _.indexBy(response.body.data, 'id')
    dispatch(getTimeline(id, timeline))
  }
}
