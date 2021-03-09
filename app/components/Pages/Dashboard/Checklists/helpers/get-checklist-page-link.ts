export function getChecklistPageLink(
  propertyType: string,
  type: IBrandChecklist['checklist_type']
) {
  return `/dashboard/checklists?property=${propertyType}&checklist_type=${type}`
}
