import * as actionTypes from 'constants/filter-segments'

import updateSegment from 'models/filter-segments/update-segment'

export function updateFilterSegment(nameId, segment, query) {
  return async dispatch => {
    try {
      const { data: list } = await updateSegment(nameId, segment, query)

      dispatch({
        type: actionTypes.SAVE_FILTER_SEGMENTS,
        namespace: 'filter-segments',
        id: nameId,
        list
      })
    } catch (error) {
      throw error
    }
  }
}
