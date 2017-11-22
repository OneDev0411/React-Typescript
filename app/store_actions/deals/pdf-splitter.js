import types from '../../constants/deals'

export function displaySplitter(display) {
  return {
    type: types.SET_SPLITTER_DISPLAY,
    display
  }
}

export function setSplitterDocument(docId, doc) {
  return {
    type: types.SET_SPLITTER_DOCUMENT,
    docId,
    doc
  }
}

export function setSplitterPage(docId, pageNumber) {
  return {
    type: types.SET_SPLITTER_PAGE,
    docId,
    pageNumber
  }
}
