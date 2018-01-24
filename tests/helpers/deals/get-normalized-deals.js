import { normalize } from 'normalizr'
import DealsList from '../../fixtures/deals/deals-list'
import * as schema from '../../../app/store_actions/deals/schema'

const { entities } = normalize(DealsList, schema.dealsSchema)
const {
  deals, roles, checklists, tasks
} = entities

export default {
  deals,
  roles,
  checklists,
  tasks
}
