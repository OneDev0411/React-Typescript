import { createFullAddress } from '@app/utils/create-full-address'

export function normalizePostgressStdaddr(address) {
  return {
    city: address.city,
    name: address.street_name,
    unit: address.unit_number ? `Unit ${address.unit_number}` : '',
    state: address.state,
    predir: address.street_prefix.value,
    suftype: address.street_suffix,
    postcode: address.postal_code,
    house_num: address.street_number,
    full: createFullAddress({
      ...address,
      street_prefix: address.street_prefix?.value
    })
  }
}
