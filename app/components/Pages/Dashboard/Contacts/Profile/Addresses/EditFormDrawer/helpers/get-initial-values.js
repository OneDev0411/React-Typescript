export function getInitialValues(addresses) {
  let addressesValues = []
  const initialValues = {
    is_primary: 0
  }

  addresses.forEach(address => {
    const { index, label } = address
    const values = { addressIndex: index }

    if (address.is_primary) {
      initialValues.is_primary = Number(index)
    }

    values.label = label
      ? { title: label, value: label }
      : { title: 'Home', value: 'Home' }

    address.fields.forEach(field => {
      values[field.attribute_def.name] = {
        attribute: field,
        value: field[field.attribute_def.data_type]
      }
    })

    addressesValues.push(values)
  })

  initialValues.addresses = addressesValues

  return initialValues
}
