import Fuse, { FuseOptions } from 'fuse.js'

import { idIsUUID } from '../../Forms/MultipleContactsSelect/AddRecipient/helpers'

const tagsFuseOptions: FuseOptions<IContactTag> = {
  keys: ['text'],
  threshold: 0.3
}
export function filterTags(
  tags: IContactTag[],
  searchTerm: string
): IContactTag[] {
  return new Fuse(tags.filter(idIsUUID), tagsFuseOptions)
    .search(searchTerm)
    .slice(0, 5)
}
