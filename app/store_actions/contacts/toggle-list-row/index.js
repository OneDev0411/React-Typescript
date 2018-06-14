import { selectRow, deselectRow } from '../pagination'
import { selectPage } from '../../../reducers/contacts/list'

export function toggleRow(pageNumber, contactId) {
  return (dispatch, getState) => {
    if (!pageNumber) {
      throw new Error('Page number is required.')
    }

    if (!contactId) {
      throw new Error('Contact id is required.')
    }

    const page = selectPage(getState().contacts.list, pageNumber)

    if (page.selectedIds.includes(contactId)) {
      dispatch(deselectRow(pageNumber, contactId))
    } else {
      dispatch(selectRow(pageNumber, contactId))
    }
  }
}
