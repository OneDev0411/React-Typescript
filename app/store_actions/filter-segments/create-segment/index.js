import * as actionTypes from '../../../constants/filter-segments'
import { createSegment } from '../../../models/filter-segments/create-segment'

export function createFilterSegment(nameId, segment) {
  return async dispatch => {
    try {
      const {
        data: { id, is_editable }
      } = await createSegment(nameId, segment)

      const list = {
        id,
        is_editable,
        ...segment
      }

      dispatch({
        type: actionTypes.SAVE_FILTER_SEGMENTS,
        namespace: 'filter-segments',
        id: nameId,
        list
      })

      return id
    } catch (error) {
      throw error
    }
  }
}
