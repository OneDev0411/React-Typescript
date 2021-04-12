import uniqBy from 'lodash/uniqBy'

import { getField } from 'models/Deal/helpers/context'

export function useFactsheetContexts(deal: IDeal, section: string) {
  const checklist = deal.property_type?.checklists?.find(checklist => {
    if (deal.has_active_offer) {
      return checklist.checklist_type === 'Offer'
    }

    return checklist.checklist_type === deal.deal_type
  })

  if (!checklist) {
    return []
  }

  const list = uniqBy(
    checklist.optional_contexts
      .concat(checklist.required_contexts)
      .filter(context => context.section === section),
    context => context.key
  )

  if (section === 'Dates') {
    const fieldsWithValue = list
      .filter(field => !!getField(deal, field.key))
      .sort((a, b) => getField(deal, a.key) - getField(deal, b.key))

    const fieldsWithoutValue = list.filter(field => !getField(deal, field.key))

    return [...fieldsWithValue, ...fieldsWithoutValue]
  }

  return list
}
