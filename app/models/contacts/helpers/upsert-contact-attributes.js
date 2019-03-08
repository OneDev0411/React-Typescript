import { updateContact } from '../update-contact'
import { normalizeContact } from './normalize-contact'

export async function upsertContactAttributes(
  contactId,
  attributes,
  query,
  isNeedNormalized = true
) {
  try {
    const response = await updateContact(
      contactId,
      attributes.map(normalizeAttribute),
      query
    )

    if (isNeedNormalized) {
      return normalizeContact(response.data)
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

function normalizeAttribute(attribute) {
  const { attribute_def } = attribute

  if (attribute_def && attribute_def.id) {
    return {
      ...attribute,
      attribute_def: attribute_def.id
    }
  }

  return attribute
}
