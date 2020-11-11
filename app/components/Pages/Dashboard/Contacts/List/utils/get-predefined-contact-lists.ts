import { getDefaultList } from 'reducers/filter-segments'
import { IAppState } from 'reducers'

import {
  PARKED_CONTACTS_LIST_ID,
  DUPLICATE_CONTACTS_LIST_ID
} from '../constants'

export const getPredefinedContactLists = (
  name,
  state: IAppState,
  includeDefaultList = true
): StringMap<ISavedSegment> => {
  const predefinedLists: StringMap<ISavedSegment<IContactAttributeFilter>> = {}

  if (includeDefaultList) {
    predefinedLists.default = getDefaultList(name)
  }

  predefinedLists.parked = {
    id: PARKED_CONTACTS_LIST_ID,
    name: 'Parked Contacts',
    is_editable: false,
    filters: []
  }

  predefinedLists.duplicates = {
    id: DUPLICATE_CONTACTS_LIST_ID,
    name: 'Duplicates',
    is_editable: false,
    filters: []
  }

  return predefinedLists
}
