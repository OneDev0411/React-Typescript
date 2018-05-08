import { getAttributeFromSummary } from '../get-attribute-from-summary'
import { getContactOriginalSourceTitle } from '../../../../utils/get-contact-original-source-title'

export function getContactSource(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  const source = getAttributeFromSummary(contact, 'source_type')

  return getContactOriginalSourceTitle(source)
}
