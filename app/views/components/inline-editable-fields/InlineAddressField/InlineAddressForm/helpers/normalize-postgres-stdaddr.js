export function normalizePostgressStdaddr(address) {
  return {
    city: address.city,
    name: address.street_name,
    unit: address.unit_number,
    state: address.state,
    predir: address.street_prefix.value,
    suftype: address.street_suffix,
    postcode: address.postal_code,
    house_num: address.street_number,
    full: [
      address.street_number,
      address.street_name,
      address.street_suffix,
      address.city,
      address.state,
      address.postal_code
    ].join(' ')
  }
}
