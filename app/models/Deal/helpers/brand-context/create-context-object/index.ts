import { getContextsChecklist } from '../get-checklist'

export function createContextObject(
  deal: IDeal,
  checklists: IDealChecklist[],
  fieldKey: string,
  value: unknown,
  approved = false
) {
  const brandChecklist = getContextsChecklist(deal)

  const definition = (brandChecklist?.required_contexts || [])
    .concat(brandChecklist?.optional_contexts || [])
    .find(item => item.key === fieldKey)

  if (!definition) {
    console.log(`Error: Invalid context key: ${fieldKey}`)

    return null
  }

  const checklist = checklists.find(
    ({ origin }) => origin === brandChecklist?.id
  )

  return {
    definition: definition!.id,
    checklist: checklist!.id,
    value,
    approved
  }
}
