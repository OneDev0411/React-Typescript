/**
 * get normalized form
 * commission logic: commission_type + commission = commission_<type>
 */
export function normalizeForm(values) {
  const newValues = {}
  const { commission, commission_type } = values

  const validFields = [
    'id',
    'contact',
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
    'future_address'
  ]

  if (commission_type === 'commission_dollar') {
    newValues.commission_dollar = parseFloat(commission)
    newValues.commission_percentage = null
  } else if (commission_type === 'commission_percentage') {
    newValues.commission_percentage = parseFloat(commission)
    newValues.commission_dollar = null
  }

  if (!values.contact) {
    newValues.source_type = 'ExplicitlyCreated'
  }

  return Object.entries({
    ...values,
    ...newValues
  }).reduce((current, [name, value]) => {
    if (validFields.includes(name)) {
      current[name] = value
    }

    return current
  }, {})
}
