import { schema } from 'normalizr'

const tag = new schema.Entity('tags')
const contact = new schema.Entity('contacts')

export const contactsSchema = { contacts: [contact] }
export const tagsSchema = { tags: [tag] }
