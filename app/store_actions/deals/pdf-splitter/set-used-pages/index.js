import * as actionTypes from '../../../../constants/deals'

export function setSplitterUsedPages(pages) {
  return {
    type: actionTypes.SET_SPLITTER_USED_PAGES,
    pages
  }
}
