import normalizeParsedAddress from './normalize-parsed-address'

export default function postLoadFormat(parsedAddress) {
  if (!parsedAddress || Object.keys(parsedAddress).length === 0) {
    return {
      street_number: '',
      street_prefix: { title: 'Select', value: '' },
      street_name: '',
      street_suffix: '',
      unit_number: '',
      city: '',
      county: '',
      state: '',
      postal_code: ''
    }
  }

  return normalizeParsedAddress(parsedAddress)
}
