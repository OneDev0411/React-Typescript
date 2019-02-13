import { postLoadFormat } from './post-load-format'

function normalizer(values) {
  return {
    ...values,
    street_prefix: values.street_prefix.value
  }
}

export function preSaveFormat(values, originalValues) {
  values = normalizer(values)

  const formatedOriginalValues = normalizer(postLoadFormat(originalValues))

  const chengedAttributes = {}

  Object.keys(values).forEach(attribute => {
    if (values[attribute] !== formatedOriginalValues[attribute]) {
      chengedAttributes[attribute] = values[attribute]
    }
  })

  return chengedAttributes
}
