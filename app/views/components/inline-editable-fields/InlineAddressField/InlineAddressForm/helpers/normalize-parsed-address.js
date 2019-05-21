export default function normalizeParsedAddress(parsedAddress) {
  const {
    number: street_number,
    prefix: street_prefix,
    street: street_name,
    type: street_suffix,
    sec_unit_num: unit_number,
    city,
    county,
    state,
    zip: postal_code
  } = parsedAddress

  return {
    street_number,
    street_prefix: street_prefix
      ? { title: street_prefix, value: street_prefix }
      : { title: 'Select', value: '' },
    street_name,
    street_suffix,
    unit_number,
    city,
    county,
    state,
    postal_code
  }
}
