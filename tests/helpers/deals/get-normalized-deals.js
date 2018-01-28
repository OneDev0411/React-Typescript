import { normalize } from 'normalizr'
import DealsList from '../../fixtures/deals/deals-list'
import * as schema from '../../../app/store_actions/deals/schema'

const { entities } = normalize(DealsList, schema.dealsSchema)

export const deals = entities.deals
export const roles = entities.roles

export default {
  deals,
  roles
}
