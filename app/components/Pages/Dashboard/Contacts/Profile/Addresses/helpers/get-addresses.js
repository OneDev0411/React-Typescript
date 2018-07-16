import _ from 'underscore'

export function getAddresses(addressesFields, addressAttributeDefs) {
  if (addressesFields.length === 0) {
    return []
  }

  let addresses = []

  const idxAddresses = _.groupBy(addressesFields, 'index')

  _.each(idxAddresses, address => {
    let fields = address

    const idxFields = _.indexBy(
      address,
      attribute => attribute.attribute_def.name
    )

    addressAttributeDefs.forEach(attribute_def => {
      let field = idxFields[attribute_def.name]

      if (!field) {
        fields.push({
          attribute_def,
          index: address[0].index,
          [attribute_def.data_type]: ''
        })
      }
    })

    fields = fields.filter(field => field.attribute_def.show)

    const { label, index, is_primary } = fields[0]

    addresses.push({ fields, index, is_primary, label })
  })

  return addresses
}
