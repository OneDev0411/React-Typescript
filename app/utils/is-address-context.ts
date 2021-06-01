export function isAddressContext(key: string) {
  return [
    'street_dir_prefix',
    'street_suffix',
    'street_number',
    'street_name',
    'unit_number',
    'city',
    'county',
    'state',
    'state_code',
    'postal_code',
    'full_address',
    'street_address'
  ].includes(key)
}