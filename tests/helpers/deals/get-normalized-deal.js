import { normalize } from 'normalizr'
import data from '../../fixtures/deals/deal-item'
import * as schema from '../../../app/store_actions/deals/schema'
import { exec } from 'child_process'

const { entities } = normalize(data, schema.dealSchema)

export const deals = entities.deals
export const roles = entities.roles
export const checklists = entities.checklists
export const envelopes = entities.envelopes
export const tasks = entities.tasks

export default {
  deals,
  roles,
  checklists,
  envelopes,
  tasks
}
