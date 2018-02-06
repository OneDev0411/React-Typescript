import _ from 'underscore'
import types from '../../constants/deals'

const initialState = {
  files: {}, // keeps files list
  pdfObjects: {}, // keeps pdfjs objects
  pages: {}, // keeps selected pages which should split
  pagePreview: null // whether previewing a page or not
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SPLITTER_DISPLAY:
      return {
        ...state,
        files: action.files
      }

    case types.SET_PAGE_PREVIEW:
      return {
        ...state,
        pagePreview: action.preview
      }

    case types.SET_SPLITTER_PDF_OBJECT:
      return {
        ...state,
        pdfObjects: {
          ...state.pdfObjects,
          [action.docId]: action.doc
        }
      }

    case types.SELECT_SPLITTER_PAGE:
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

    case types.DESELECT_SPLITTER_PAGE:
      return {
        ...state,
        pages: _.omit(
          state.pages,
          page =>
            page.documentId === action.docId && page.pageNumber === action.pageNumber
        )
      }

    case types.RESET_SPLITTER_PAGES:
      return {
        ...state,
        pages: {}
      }

    case types.RESET_SPLITTER:
      return initialState

    default:
      return state
  }
}
