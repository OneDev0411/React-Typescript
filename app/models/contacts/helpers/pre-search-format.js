import removeSpecialCharacters from 'utils/remove-special-characters'

function preSearchFormat({
  attributeFilters,
  crm_tasks,
  flows,
  text,
  queryParams,
  users
}) {
  const payload = {}
  const query = removeSpecialCharacters(text)

  if (query.length > 0) {
    payload.query = query
  }

  if (validArrayFilter(flows)) {
    payload.flows = flows
  }

  if (validArrayFilter(crm_tasks)) {
    payload.crm_task = crm_tasks
  }

  if (validArrayFilter(users)) {
    payload.users = users
  }

  if (validArrayFilter(attributeFilters)) {
    payload.filter = normalizeAttributeFilters(attributeFilters)
  }

  return [payload, queryParams]
}

function validArrayFilter(filter) {
  return Array.isArray(filter) && filter.length > 0
}

function normalizeAttributeFilters(filters) {
  return filters
    .filter(({ attribute_def }) => attribute_def)
    .map(({ attribute_def, invert, operator, value }) => ({
      attribute_def,
      invert,
      operator,
      value
    }))
}

export default preSearchFormat
