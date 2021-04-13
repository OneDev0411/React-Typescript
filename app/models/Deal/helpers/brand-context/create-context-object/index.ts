export function createContextObject(
  deal: IDeal,
  checklists: IDealChecklist[],
  checklistType: IDealChecklistType,
  fieldKey: string,
  value: unknown,
  approved = false
) {
  const brandChecklist = deal.property_type.checklists?.find(
    checklist => checklist.checklist_type === checklistType
  )

  const definition = brandChecklist?.required_contexts
    .concat(brandChecklist?.optional_contexts)
    .find(item => item.key === fieldKey)

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
