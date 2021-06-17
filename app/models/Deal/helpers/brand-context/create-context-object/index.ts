import { getContextsChecklist } from '../get-checklist'

export function createContextObject(
  deal: IDeal,
  brandChecklists: IBrandChecklist[],
  checklists: IDealChecklist[],
  fieldKey: string,
  value: unknown,
  approved = false
) {
  const dealBrandChecklists = getContextsChecklist(deal, brandChecklists)

  const definition = dealBrandChecklists
    .flatMap(item =>
      (item.optional_contexts || []).concat(item.required_contexts || [])
    )
    .find(item => item.key === fieldKey)

  if (!definition) {
    console.log(`Error: Invalid context key: ${fieldKey}`)

    return null
  }

  const checklist = checklists.find(
    ({ origin, checklist_type, is_active_offer }) => {
      return dealBrandChecklists.find(({ id }) =>
        checklist_type === 'Offer'
          ? id === origin && is_active_offer
          : id === origin
      )
    }
  )

  return {
    definition: definition!.id,
    checklist: checklist!.id,
    value,
    approved
  }
}
