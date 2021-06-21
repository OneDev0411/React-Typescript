import { searchContext } from '../search-context'

export function getDefinitionId(
  deal: IDeal,
  brandChecklists: IBrandChecklist[],
  key: string
): UUID | undefined {
  const context = searchContext(deal, brandChecklists, key)

  return context?.id
}
