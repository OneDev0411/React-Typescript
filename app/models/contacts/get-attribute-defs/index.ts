import Fetch from '../../../services/fetch'

export async function getAttributeDefs(): Promise<{
  list: IContactAttributeDef[]
  byId: Record<UUID, IContactAttributeDef>
  byName: Record<string, UUID>
  bySection: Record<string, UUID[]>
}> {
  try {
    const response = await new Fetch().get('/contacts/attribute_defs')

    const { data } = response.body

    return {
      list: data,
      byId: groupById(data),
      byName: groupByName(data),
      bySection: groupBySection(data)
    }
  } catch (error) {
    throw error
  }
}

/**
 * Normalizes attribute definitions by their ids
 *
 * @param list of attribute definitions
 * @returns a record<id, attributeDef>
 */
function groupById(
  list: IContactAttributeDef[]
): Record<UUID, IContactAttributeDef> {
  return list.reduce((list, item) => {
    return {
      ...list,
      [item.id]: item
    }
  }, {})
}

/**
 * Groups attribute definitions by their names
 *
 * @param list of attribute definitions
 * @returns a record<string, id>
 */
function groupByName(list: IContactAttributeDef[]): Record<string, UUID> {
  return list.reduce((list, item) => {
    if (!item.name) {
      return list
    }

    return {
      ...list,
      [item.name]: item.id
    }
  }, {})
}

/**
 * Normalizes attribute definitions by their sections
 *
 * @param list of attribute definitions
 * @returns a record<string, string[]>
 */
function groupBySection(list: IContactAttributeDef[]): Record<string, UUID[]> {
  return list.reduce((list, item) => {
    return {
      ...list,
      [item.section]: [...(list[item.section] ?? []), item.id]
    }
  }, {})
}
