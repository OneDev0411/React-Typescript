import * as actionTypes from 'constants/filter-segments'

import createSegment from 'models/filter-segments/create-segment'

export function createFilterSegment(nameId, segment, query) {
  return async dispatch => {
    try {
      const { data: list } = await createSegment(nameId, segment, query)

      dispatch({
        type: actionTypes.SAVE_FILTER_SEGMENTS,
        namespace: 'filter-segments',
        id: nameId,
        list
      })

      return list
    } catch (error) {
      throw error
    }
  }
}
