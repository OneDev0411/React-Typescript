import * as actionTypes from 'constants/filter-segments'

import getSegments from 'models/filter-segments/get-segments'

export function getSavedSegments(nameId, query) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_FILTER_SEGMENTS,
        namespace: 'filter-segments',
        id: nameId
      })

      const { data } = await getSegments(nameId, query)

      const list = {}

      data.forEach(item => (list[item.id] = item))

      dispatch({
        type: actionTypes.FETCH_FILTER_SEGMENTS_SUCCESS,
        namespace: 'filter-segments',
        id: nameId,
        list
      })
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_FILTER_SEGMENTS_FAILURE,
        namespace: 'filter-segments',
        id: nameId,
        error
      })

      throw error
    }
  }
}
