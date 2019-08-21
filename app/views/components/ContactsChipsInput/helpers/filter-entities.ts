import Fuse from 'fuse.js'

import { idIsUUID } from '../../Forms/MultipleContactsSelect/AddRecipient/helpers'

export function filterEntities<T>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  return new Fuse(items.filter(idIsUUID), {
    keys: fields,
    threshold: 0.3
  })
    .search(searchTerm)
    .slice(0, 5)
}
