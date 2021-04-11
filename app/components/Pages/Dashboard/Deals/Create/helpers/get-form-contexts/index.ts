import { getContext } from 'models/Deal/helpers/context'

export function getFormContexts(
  values: Record<string, unknown>,
  deal: IDeal,
  checklists: IDealChecklist[]
) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (value === undefined || key.includes('context') === false) {
      return acc
    }

    const [, name] = key.split(':')
    const context = getContext(deal, name)

    const definition = deal.property_type.checklists
      ?.find(checklist => checklist.checklist_type === deal.deal_type)
      ?.required_contexts.find(item => item.key === name)

    const checklist = checklists.find(({ origin }) => {
      return deal.property_type.checklists?.some(item => item.id === origin)
    })

    return [
      ...acc,
      {
        value,
        definition: definition?.id,
        checklist: checklist?.id,
        approved: context ? context.needs_approval : false
      }
    ]
  }, [])
}
