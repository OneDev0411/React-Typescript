import { schema } from 'normalizr'

const tasks = new schema.Entity('tasks')

const checklists = new schema.Entity('checklists', {
  tasks: [tasks]
})

export const deal = new schema.Entity('deals', {
  checklists: [checklists]
})

export const dealsSchema = [deal]
export const dealSchema = deal
