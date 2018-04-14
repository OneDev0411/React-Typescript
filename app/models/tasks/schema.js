import { schema } from 'normalizr'

const task = new schema.Entity('tasks')

export const tasksSchema = { tasks: [task] }
