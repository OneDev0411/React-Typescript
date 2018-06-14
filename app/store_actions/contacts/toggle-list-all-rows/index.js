import { selectAllRows, deselectAllRows } from '../pagination'
import { selectPage } from '../../../reducers/contacts/list'

export function toggleAllRows(pageNumber) {
  return (dispatch, getState) => {
    if (!pageNumber) {
      throw new Error('Page number is required.')
    }

    const page = selectPage(getState().contacts.list, pageNumber)

    if (page.ids.length === page.selectedIds.length) {
      dispatch(deselectAllRows(pageNumber))
    } else {
      dispatch(selectAllRows(pageNumber))
    }
  }
}
