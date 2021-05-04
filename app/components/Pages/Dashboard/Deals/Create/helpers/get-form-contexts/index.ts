import {
  getChecklist,
  getDefinitionId
} from 'models/Deal/helpers/dynamic-context'
import { getContext } from 'models/Deal/helpers/context'

export function getFormContexts(
  values: Record<string, unknown>,
  deal: IDeal,
  checklist?: IDealChecklist
) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (value === undefined || !key.includes('context')) {
      return acc
    }

    const [, name] = key.split(':')
    const context = getContext(deal, name)

    return [
      ...acc,
      {
        value,
        definition: getDefinitionId(deal.id, name),
        checklist: checklist ? checklist.id : getChecklist(deal, name),
        approved: context ? context.needs_approval : false
      }
    ]
  }, [])
}
