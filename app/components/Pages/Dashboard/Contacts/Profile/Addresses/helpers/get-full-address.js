export function getFullAddress(fields) {
  // Address Fields Indexed By Name
  const idxName = {}

  fields.forEach(field => {
    const value = field[field.attribute_def.data_type]

    idxName[field.attribute_def.name] = value == null ? '' : value
  })

  let fullAddress = `${idxName.street_number} ${idxName.street_prefix} ${
    idxName.street_name
  } ${idxName.street_suffix}`

  if (idxName.unit_number) {
    fullAddress = `${fullAddress}, Unit ${idxName.unit_number}`
  }

  fullAddress = `${fullAddress}, ${idxName.city} ${idxName.state} ${
    idxName.postal_code
  }`

  return fullAddress.replace('  ', ' ').trim()
}
