import * as actionTypes from '../../../../constants/deals'

export function selectSplitterPage(docId, pageNumber) {
  return {
    type: actionTypes.SELECT_SPLITTER_PAGE,
    docId,
    pageNumber
  }
}
