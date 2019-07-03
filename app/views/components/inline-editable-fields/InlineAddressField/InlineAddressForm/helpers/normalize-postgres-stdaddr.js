export function normalizePostgressStdaddr(address) {
  return {
    city: address.city,
    name: address.street_name,
    unit: address.unit_number,
    state: address.state,
    predir: address.street_prefix.value,
    postcode: address.postal_code,
    house_num: address.street_number
  }
}
