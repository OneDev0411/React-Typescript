import { schema } from 'normalizr'

// schema for task
const task = new schema.Entity('tasks')

// schema for single checklist
const checklist = new schema.Entity('checklists', {
  tasks: [task]
})

// schema for deal
export const deal = new schema.Entity('deals', {
  checklists: [checklist]
})

export const taskSchema = [task]
export const dealsSchema = [deal]
export const dealSchema = deal
export const checklistSchema = checklist
