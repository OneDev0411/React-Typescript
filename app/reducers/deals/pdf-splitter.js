import _ from 'underscore'
import types from '../../constants/deals'

const initialState = {
  display: false,
  documents: {},
  pages: {},
  pagePreview: null
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.SET_SPLITTER_DISPLAY:
      return {
        ...state,
        display: action.display
      }

    case types.SET_PAGE_PREVIEW:
      return {
        ...state,
        pagePreview: action.preview
      }

    case types.SET_SPLITTER_DOCUMENT:
      return {
        ...state,
        documents: {
          ...state.documents,
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
        pages: _.omit(state.pages, page =>
          page.documentId === action.docId && page.pageNumber === action.pageNumber)
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
