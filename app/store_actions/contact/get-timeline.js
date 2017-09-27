import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function timelineFetched (id, timeline) {
  return {
    type: types.GET_TIMELINE,
    id,
    timeline
  }
}

export function getTimeline (id) {
  return async (dispatch) => {
    const response = await Contact.getTimeline(id)
    const timeline = _.indexBy(response.body.data, 'id')
    dispatch(timelineFetched(id, timeline))
  }
}
