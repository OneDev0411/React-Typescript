import _ from 'underscore'
import * as actionTypes from '../../constants/deals'

const initialState = {
  files: {}, // keeps files list
  pdfObjects: {}, // keeps pdfjs objects
  pages: {}, // keeps selected pages which should split
  usedPages: {}, // keeps used pages in the current workspace
  pagePreview: null // whether previewing a page or not
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SPLITTER_DISPLAY:
      return {
        ...state,
        files: action.files
      }

    case actionTypes.SET_PAGE_PREVIEW:
      return {
        ...state,
        pagePreview: action.preview
      }

    case actionTypes.SET_SPLITTER_PDF_OBJECT:
      return {
        ...state,
        pdfObjects: {
          ...state.pdfObjects,
          [action.docId]: action.doc
        }
      }

    case actionTypes.SELECT_SPLITTER_PAGE:
      return {
        ...state,
        pages: {
          ...state.pages,
          [`${action.docId}_${action.pageNumber}`]: {
            documentId: action.docId,
            pageNumber: action.pageNumber
          }
        }
      }

    case actionTypes.SET_SPLITTER_USED_PAGES:
      return {
        ...state,
        usedPages: {
          ...state.usedPages,
          ...action.pages
        }
      }

    case actionTypes.DESELECT_SPLITTER_PAGE:
      return {
        ...state,
        pages: _.omit(
          state.pages,
          page =>
            page.documentId === action.docId &&
            page.pageNumber === action.pageNumber
        )
      }

    case actionTypes.RESET_SPLITTER_PAGES:
      return {
        ...state,
        pages: {}
      }

    case actionTypes.RESET_SPLITTER:
      return initialState

    default:
      return state
  }
}
