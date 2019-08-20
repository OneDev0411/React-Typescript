import Fuse, { FuseOptions } from 'fuse.js'

import { idIsUUID } from '../../Forms/MultipleContactsSelect/AddRecipient/helpers'

const listsFuseOptions: FuseOptions<IContactList> = {
  keys: ['name'],
  threshold: 0.3
}

export function filterLists(
  lists: IContactList[],
  searchTerm: string
): IContactList[] {
  return new Fuse(lists.filter(idIsUUID), listsFuseOptions)
    .search(searchTerm)
    .slice(0, 5)
}
