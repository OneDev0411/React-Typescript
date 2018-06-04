import * as actionTypes from '../../../constants/filter-segments'
import { createSegment } from '../../../models/filter-segments/create-segment'

export function createFilterSegment(nameId, segment) {
  return async dispatch => {
    try {
      const { data: id } = await createSegment(nameId, segment)
      const list = {
        id,
        ...segment
      }

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
