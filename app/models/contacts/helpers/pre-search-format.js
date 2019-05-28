import { cleanSearchQuery } from 'utils/clean-search-query'

function validArrayFilter(filter) {
  return Array.isArray(filter) && filter.length > 0
}

function preFilterFormat(filters) {
  let {
    query,
    attributeFilters,
    flows,
    crm_tasks,
    ...rest
  } = filters

  let payload = rest

  query = cleanSearchQuery(query.trim())

  if (query.length > 0) {
    payload.query = q
  }

  if (validArrayFilter(flows)) {
    payload.flows = flows
  }

  if (validArrayFilter(crm_tasks)) {
    payload.crm_tasks = flows
  }

  if (validArrayFilter(attributeFilters)) {
    payload.filter = attributeFilters
      .filter(filter => filter.attribute_def)
      .map(({ attribute_def, invert, operator, value }) => ({
        attribute_def,
        invert,
        operator,
        value
      }))
  }

  return payload
}

export default preFilterFormat