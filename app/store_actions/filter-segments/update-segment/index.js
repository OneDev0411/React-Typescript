import * as actionTypes from '../../../constants/filter-segments'
import { updateSegment } from '../../../models/filter-segments/update-segment'

export function updateFilterSegment(nameId, segment) {
  return async dispatch => {
    try {
      const { data: lists } = await updateSegment(nameId, segment)

      dispatch({
        type: actionTypes.SAVE_FILTER_SEGMENTS,
        namespace: 'filter-segments',
        id: nameId,
        list: lists[0]
      })
    } catch (error) {
      throw error
    }
  }
}
