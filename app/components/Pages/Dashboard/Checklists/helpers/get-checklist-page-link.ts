export function getChecklistPageLink(
  propertyType: string,
  dealType: IBrandChecklist['deal_type']
) {
  return `/dashboard/checklists?property_type=${propertyType}&deal_type=${dealType}`
}
