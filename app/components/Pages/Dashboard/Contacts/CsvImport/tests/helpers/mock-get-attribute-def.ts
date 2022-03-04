import {
  groupById,
  groupByName,
  groupBySection
} from '@app/models/contacts/get-attribute-defs'
import attributeDefs from 'fixtures/contacts/attribute-definitions.json'

export const mockAttributeDefs = {
  list: attributeDefs,
  byId: groupById(attributeDefs as IContactAttributeDef[]),
  byName: groupByName(attributeDefs as IContactAttributeDef[]),
  bySection: groupBySection(attributeDefs as IContactAttributeDef[])
}
