import _ from 'underscore'

import { getFullAddress } from './get-full-address'

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

const normalizeAddress = fields => {
  const { label, index, is_primary } = fields[0]

  return {
    index,
    label,
    fields,
    is_primary,
    full_address: getFullAddress(fields)
  }
}

export const generateEmptyAddress = (addressAttributeDefs, nextIndex) =>
  normalizeAddress(
    normalizeAttributesToFields(
      addressAttributeDefs,
      undefined,
      undefined,
      nextIndex
    )
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

    addresses.push(normalizeAddress(fields))
  })

  return addresses
}
