import * as actionTypes from '../../../constants/filter-segments'

export function changeActiveFilterSegment(nameId: string, segmentId: string) {
  return {
    type: actionTypes.CHANGE_ACTIVE_FILTER_SEGMENT,
    namespace: 'filter-segments',
    id: nameId,
    segmentId
  }
}
