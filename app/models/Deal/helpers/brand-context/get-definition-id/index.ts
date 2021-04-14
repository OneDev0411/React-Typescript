import { searchContext } from '../search-context'

export function getDefinitionId(deal: IDeal, key: string): UUID {
  const context = searchContext(deal, key)

  return context!.id
}
