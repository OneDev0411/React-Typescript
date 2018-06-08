import _ from 'underscore'

import * as actionTypes from '../../../constants/filter-segments'
import { getSavedSegments as fetchAll } from '../../../models/filter-segments/get-saved-segments'

export function getSavedSegments(nameId) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_FILTER_SEGMENTS,
        namespace: 'filter-segments',
        id: nameId
      })

      const { data } = await fetchAll(nameId)

      dispatch({
        type: actionTypes.FETCH_FILTER_SEGMENTS_SUCCESS,
        namespace: 'filter-segments',
        id: nameId,
        list: _.indexBy(data, 'id')
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
