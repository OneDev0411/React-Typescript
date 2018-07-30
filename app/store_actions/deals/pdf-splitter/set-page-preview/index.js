import * as actionTypes from '../../../../constants/deals'

export function setPagePreview(preview) {
  return {
    type: actionTypes.SET_PAGE_PREVIEW,
    preview
  }
}
