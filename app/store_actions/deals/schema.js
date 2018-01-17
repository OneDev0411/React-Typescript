import { schema } from 'normalizr'

// schema for role
const role = new schema.Entity('roles')

// schema for envelope
const envelope = new schema.Entity('envelopes')

// schema for task
const task = new schema.Entity('tasks')

// schema for single checklist
const checklist = new schema.Entity('checklists', {
  tasks: [task]
})

// schema for deal
export const deal = new schema.Entity('deals', {
  roles: [role],
  envelopes: [envelope],
  checklists: [checklist]
})

export const taskSchema = [task]
export const roleSchema = [role]
export const dealsSchema = [deal]
export const dealSchema = deal
export const checklistSchema = checklist
