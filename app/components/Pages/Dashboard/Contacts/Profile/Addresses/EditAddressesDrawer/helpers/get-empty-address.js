function getValue(type) {
  switch (type) {
    case 'number':
      return 0
    case 'date':
      return new Date().getTime()
    default:
      return ''
  }
}

export function getEmptyAddress(attributeDefs, addressIndex = 1) {
  const address = {
    addressIndex,
    label: { title: 'Other', value: 'Other' }
  }

  attributeDefs.forEach(attribute_def => {
    if (attribute_def.show) {
      const value = getValue(attribute_def.data_type)

      address[attribute_def.name] = {
        attribute: {
          attribute_def,
          index: addressIndex,
          [attribute_def.data_type]: value
        },
        value
      }
    }
  })

  return address
}
