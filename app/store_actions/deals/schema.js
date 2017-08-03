import { schema } from 'normalizr'

const tasks = new schema.Entity('tasks')

const checklists = new schema.Entity('checklists', {
  tasks: [tasks]
})

export const deals = new schema.Entity('deals', {
  checklists: [checklists]
})

export const deal = [deals]
