import * as actionTypes from '../../../constants/filter-segments'

export function changeActiveFilterSegment(
  nameId: string,
  segmentId: string,
  customType?: string
) {
  const type = customType || actionTypes.CHANGE_ACTIVE_FILTER_SEGMENT

  return {
    type,
    namespace: 'filter-segments',
    id: nameId,
    segmentId
  }
}
