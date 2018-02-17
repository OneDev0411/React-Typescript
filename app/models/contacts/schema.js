import { schema } from 'normalizr'

const contact = new schema.Entity('contacts')

export const contactsSchema = { contacts: [contact] }
