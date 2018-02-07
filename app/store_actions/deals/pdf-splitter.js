import _ from 'underscore'
import types from '../../constants/deals'

export function displaySplitter(files = {}) {
  return {
    type: types.SET_SPLITTER_DISPLAY,
    files: _.indexBy(files, 'id')
  }
}

export function setSplitterUsedPages(pages) {
  return {
    type: types.SET_SPLITTER_USED_PAGES,
    pages
  }
}

export function setSplitterPdfObject(docId, doc) {
  return {
    type: types.SET_SPLITTER_PDF_OBJECT,
    docId,
    doc
  }
}

export function selectSplitterPage(docId, pageNumber) {
  return {
    type: types.SELECT_SPLITTER_PAGE,
    docId,
    pageNumber
  }
}

export function deselectSplitterPage(docId, pageNumber) {
  return {
    type: types.DESELECT_SPLITTER_PAGE,
    docId,
    pageNumber
  }
}

export function resetSplitterSelectedPages() {
  return {
    type: types.RESET_SPLITTER_PAGES
  }
}

export function setPagePreview(preview) {
  return {
    type: types.SET_PAGE_PREVIEW,
    preview
  }
}

export function resetSplitter() {
  return {
    type: types.RESET_SPLITTER
  }
}
