export const propertyTypeToSideNavItem = dealType => propertyType => ({
  title: propertyType,
  link: `/dashboard/checklists?property_type=${propertyType}&deal_type=${dealType}`
})
