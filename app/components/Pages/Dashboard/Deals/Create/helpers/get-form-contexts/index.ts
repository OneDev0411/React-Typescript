import { getContext } from 'models/Deal/helpers/context'

export function getFormContexts(
  values: Record<string, unknown>,
  deal: IDeal,
  checklists: IDealChecklist[],
  checklistType: IBrandChecklist['checklist_type']
) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (value === undefined || key.includes('context') === false) {
      return acc
    }

    const [, name] = key.split(':')
    const context = getContext(deal, name)

    const brandChecklist = deal.property_type.checklists?.find(
      checklist => checklist.checklist_type === checklistType
    )

    const definition = brandChecklist?.required_contexts.find(
      item => item.key === name
    )

    const checklist = checklists.find(
      ({ origin }) => origin === brandChecklist?.id
    )

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
