import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'

export function preSaveFormat(values, attributeDefs) {
  const attributes = []
  const selectFields = ['title']
  const multipleFields = ['email', 'phone_number']
  const textFields = ['first_name', 'middle_name', 'last_name', 'source']

  const sourceTypeDef = selectDefinitionByName(attributeDefs, 'source_type')

  if (sourceTypeDef) {
    attributes.push({
      text: 'ExplicitlyCreated',
      attribute_def: sourceTypeDef.id
    })
  }

  textFields.forEach(field => {
    if (values[field]) {
      const attribute_def = selectDefinitionByName(attributeDefs, field)

      if (attribute_def) {
        attributes.push({
          text: values[field],
          attribute_def: attribute_def.id
        })
      }
    }
  })

  selectFields.forEach(field => {
    const attribute_def = selectDefinitionByName(attributeDefs, field)
    const text = (values[field] && values[field].value) || values[field]

    if (attribute_def && text && text !== '-Select-') {
      attributes.push({
        text,
        attribute_def: attribute_def.id
      })
    }
  })

  multipleFields.forEach(field => {
    const attribute_def = selectDefinitionByName(attributeDefs, field)

    if (attribute_def) {
      values[field].forEach(({ label, text }, index) => {
        if (text && label && label.value) {
          attributes.push({
            text,
            label: label.value,
            index: index + 1,
            is_primary: index === 0,
            attribute_def: attribute_def.id
          })
        }
      })
    }
  })

  values.tags.forEach(tag => {
    const attributeDef = selectDefinitionByName(attributeDefs, 'tag')

    attributes.push({
      attribute_def: attributeDef.id,
      text: tag.text
    })
  })

  return attributes
}
