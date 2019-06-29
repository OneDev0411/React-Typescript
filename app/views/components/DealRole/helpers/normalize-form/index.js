import addressParser from 'parse-address'

import normalizeParsedAddress from 'components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/normalize-parsed-address'

/**
 * get normalized form
 * commission logic: commission_type + commission = commission_<type>
 */
export function normalizeForm(values) {
  const normalized = {}
  const { commission, commission_type } = values

  const validFields = [
    'id',
    'contact',
    'brand',
    'agent',
    'legal_prefix',
    'legal_first_name',
    'legal_middle_name',
    'legal_last_name',
    'company_title',
    'email',
    'phone_number',
    'role',
    'commission',
    'commission_dollar',
    'commission_percentage',
    'source_type',
    'role_type',
    'current_address',
    'parsed_current_address',
    'future_address',
    'parsed_future_address',
    'office_email',
    'office_fax',
    'office_license_number',
    'office_mls_id',
    'office_name',
    'office_address'
  ]

  if (values.agent instanceof Object && values.agent.id) {
    normalized.agent = values.agent.id
  }

  if (commission_type === 'commission_dollar') {
    normalized.commission_dollar = parseFloat(commission)
    normalized.commission_percentage = null
  } else if (commission_type === 'commission_percentage') {
    normalized.commission_percentage = parseFloat(commission)
    normalized.commission_dollar = null
  }

  if (!values.contact) {
    normalized.source_type = 'ExplicitlyCreated'
  }

  // parse current and future address separated fields for saving into contact
  normalized.parsed_current_address = addressNormalizer(values.current_address)
  normalized.parsed_future_address = addressNormalizer(values.future_address)

  return Object.entries({
    ...values,
    ...normalized
  }).reduce((acc, [name, value]) => {
    if (!validFields.includes(name)) {
      return acc
    }

    return {
      ...acc,
      [name]: typeof value === 'string' ? value.trim() : value
    }
  }, {})
}

function addressNormalizer(address) {
  const parsed = address ? addressParser.parseLocation(address) : {}
  const normalized = normalizeParsedAddress(parsed)

  return Object.entries(normalized).reduce((acc, [name, item]) => {
    const value = typeof item === 'object' && item !== null ? item.value : item

    if (!value) {
      return acc
    }

    return {
      ...acc,
      [name]: value
    }
  }, {})
}
