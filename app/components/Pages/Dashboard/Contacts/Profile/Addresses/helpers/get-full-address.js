export function getFullAddress(fields) {
  // Address Fields Indexed By Name
  const idxName = {}

  fields.forEach(field => {
    const value = field[field.attribute_def.data_type]

    idxName[field.attribute_def.name] = value == null ? '' : value
  })

  const street = `${idxName.street_number} ${idxName.street_prefix} ${
    idxName.street_name
  } ${idxName.street_suffix}`

  const unit = idxName.unit_number ? `Unit ${idxName.unit_number}` : ''

  const others = `${idxName.city} ${idxName.state} ${idxName.postal_code}`

  return [street, unit, others]
    .map(item => item.replace('  ', '').trim())
    .filter(item => item)
    .join(', ')
}
