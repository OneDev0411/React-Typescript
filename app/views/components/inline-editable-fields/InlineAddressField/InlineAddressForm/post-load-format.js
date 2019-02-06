export function postLoadFormat(parsedAddress) {
  if (!parsedAddress || Object.keys(parsedAddress).length === 0) {
    return {
      street_number: '',
      dir: '',
      street_name: '',
      suffix: '',
      unit: '',
      city: '',
      state: '',
      zip_code: ''
    }
  }

  const {
    number: street_number,
    prefix: dir,
    street: street_name,
    suffix,
    sec_unit_num: unit,
    city,
    state,
    zip: zip_code
  } = parsedAddress

  return {
    street_number,
    dir,
    street_name,
    suffix,
    unit,
    city,
    state,
    zip_code
  }
}
