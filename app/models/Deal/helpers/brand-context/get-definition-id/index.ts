import { searchContext } from '../search-context'

export function getDefinitionId(deal: IDeal, key: string): UUID | undefined {
  const context = searchContext(deal, key)

  return context?.id
}
