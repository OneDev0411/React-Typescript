export function getChecklistPageLink(
  propertyType: string,
  type: IDealChecklistType
) {
  return `/dashboard/checklists?property=${propertyType}&checklist_type=${type}`
}
