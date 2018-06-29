import _ from 'underscore'
import * as actionTypes from '../../constants/deals'

export function displaySplitter(files = {}) {
  return {
    type: actionTypes.SET_SPLITTER_DISPLAY,
    files: _.indexBy(files, 'id')
  }
}

export function setSplitterUsedPages(pages) {
  return {
    type: actionTypes.SET_SPLITTER_USED_PAGES,
    pages
  }
}

export function setSplitterPdfObject(docId, doc) {
  return {
    type: actionTypes.SET_SPLITTER_PDF_OBJECT,
    docId,
    doc
  }
}

export function selectSplitterPage(docId, pageNumber) {
  return {
    type: actionTypes.SELECT_SPLITTER_PAGE,
    docId,
    pageNumber
  }
}

export function deselectSplitterPage(docId, pageNumber) {
  return {
    type: actionTypes.DESELECT_SPLITTER_PAGE,
    docId,
    pageNumber
  }
}

export function resetSplitterSelectedPages() {
  return {
    type: actionTypes.RESET_SPLITTER_PAGES
  }
}

export function setPagePreview(preview) {
  return {
    type: actionTypes.SET_PAGE_PREVIEW,
    preview
  }
}

export function resetSplitter() {
  return {
    type: actionTypes.RESET_SPLITTER
  }
}
