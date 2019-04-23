import postLoadFormat from 'components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/post-load-format'

function normalizer(values) {
  return {
    ...values,
    street_prefix: values.street_prefix.value
  }
}

export function preSaveFormat(values, originalValues, address) {
  values = normalizer(values)

  originalValues = address && address.id ? originalValues : {}

  const formatedOriginalValues = normalizer(postLoadFormat(originalValues))

  const chengedAttributes = {}

  Object.keys(values).forEach(attribute => {
    if (values[attribute] !== formatedOriginalValues[attribute]) {
      chengedAttributes[attribute] = values[attribute]
    }
  })

  return chengedAttributes
}
