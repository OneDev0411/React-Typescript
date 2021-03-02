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
    'future_address',
    'office_email',
    'office_phone',
    'office_fax',
    'office_license_number',
    'office_mls_id',
    'office_name',
    'office_address',
    'checklist'
  ]

  if (values.agent instanceof Object && values.agent.id) {
    normalized.agent = values.agent.id
  }

  if (commission_type === 'commission_dollar') {
    normalized.commission_dollar =
      commission != null && commission !== '' ? parseFloat(commission) : ''
    normalized.commission_percentage = null
  } else if (commission_type === 'commission_percentage') {
    normalized.commission_percentage =
      commission != null && commission !== '' ? parseFloat(commission) : ''
    normalized.commission_dollar = null
  }

  if (!values.contact) {
    normalized.source_type = 'ExplicitlyCreated'
  }

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
