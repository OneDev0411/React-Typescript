import * as actionTypes from '../../../../constants/deals'

export function deselectSplitterPage(docId, pageNumber) {
  return {
    type: actionTypes.DESELECT_SPLITTER_PAGE,
    docId,
    pageNumber
  }
}
