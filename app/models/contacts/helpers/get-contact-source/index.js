import { getContactOriginalSourceTitle } from '../../../../utils/get-contact-original-source-title'
import { getAttributeFromSummary } from '../get-attribute-from-summary'

export function getContactSource(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  const source = getAttributeFromSummary(contact, 'source_type')

  return getContactOriginalSourceTitle(source)
}
