import { getEmptyAddress } from './get-empty-address'
import { getNewAddressIndex } from './get-address-index'

export function getInitialValues(addresses, addressAttributeDefs) {
  const initialValues = {
    is_primary: 1
  }

  if (addresses.length === 0) {
    initialValues.addresses = [getEmptyAddress(addressAttributeDefs)]

    return initialValues
  }

  let addressesValues = []

  addresses.forEach(address => {
    let { index, label } = address

    index =
      index == null
        ? getNewAddressIndex(addresses, { value: addresses })
        : index

    const values = {
      addressIndex: index
    }

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
