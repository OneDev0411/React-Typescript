import * as actionTypes from '../../../constants/filter-segments'
import { deleteSegment } from '../../../models/filter-segments/delete-segment'

export function deleteFilterSegment(nameId, segment) {
  return async dispatch => {
    try {
      await deleteSegment(nameId, segment.id)

      dispatch({
        type: actionTypes.DELETE_FILTER_SEGMENTS,
        namespace: 'filter-segments',
        id: nameId,
        segmentId: segment.id
      })
    } catch (error) {
      throw error
    }
  }
}
