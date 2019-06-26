import _ from 'underscore'

import { getFullAddress } from 'models/contacts/helpers/get-contact-fulladdress'

const indexAddressByFields = address =>
  _.indexBy(address, attribute => attribute.attribute_def.name)

const normalizeAttributesToFields = (
  addressAttributeDefs,
  indexedFields = {},
  address = [],
  nextIndex = 0
) => {
  let fields = address

  addressAttributeDefs.forEach(attribute_def => {
    let field = indexedFields[attribute_def.name]

    if (!field) {
      fields.push({
        attribute_def,
        [attribute_def.data_type]: '',
        index: address.length ? address[0].index : nextIndex
      })
    }
  })

  return fields
}

const normalizeAddress = (
  attributes,
  isActive = false,
  defaultLabel = 'Other',
  isPrimary = false
) => {
  const {
    id,
    label,
    index,
    is_primary,
    attribute_def: { labels }
  } = attributes[0]

  return {
    id,
    index,
    labels,
    isActive,
    attributes,
    full_address: getFullAddress(attributes),
    label: id == null || label == null ? defaultLabel : label,
    is_primary: is_primary == null ? isPrimary : is_primary
  }
}

export const generateEmptyAddress = (
  addressAttributeDefs,
  addresses,
  isActive,
  defaultLabel,
  isPrimary
) =>
  normalizeAddress(
    normalizeAttributesToFields(
      addressAttributeDefs,
      undefined,
      undefined,
      generateNextIndex(addresses)
    ),
    isActive,
    defaultLabel,
    isPrimary
  )

export function getAddresses(addressesFields, addressAttributeDefs) {
  if (addressesFields.length === 0) {
    return []
  }

  let addresses = []

  const idxAddresses = _.groupBy(addressesFields, 'index')

  _.each(idxAddresses, address => {
    const fields = normalizeAttributesToFields(
      addressAttributeDefs,
      indexAddressByFields(address),
      address
    ).filter(field => field.attribute_def.show)

    const defaultLabel = addresses.length === 0 ? 'Home' : 'Other'

    addresses.push(normalizeAddress(fields, false, defaultLabel))
  })

  return addresses
}

export const generateNextIndex = addresses =>
  addresses.length > 0 ? Math.max(...addresses.map(a => a.index)) + 1 : 1
