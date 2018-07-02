import * as actionTypes from '../../../../constants/deals'

export function setSplitterPdfObject(docId, doc) {
  return {
    type: actionTypes.SET_SPLITTER_PDF_OBJECT,
    docId,
    doc
  }
}
