export const brokerageFields: string[] = [
  'office_name',
  'office_email',
  'office_phone',
  'office_fax',
  'office_license_number',
  'office_mls_id',
  'office_address.line1',
  'office_address.line2',
  'office_address.full',
  'office_address.city',
  'office_address.state',
  'office_address.postal_code',
  'agent.office.name',
  'agent.office.email',
  'agent.office.phone',
  'agent.office.fax',
  'agent.office.license_number',
  'agent.office.mls_id',
  'agent.office.address',
  'agent.office.address_line2',
  'agent.office.city',
  'agent.office.state',
  'agent.office.postal_code'
]

export function isBrokerageField(annotation): boolean {
  if (annotation.attribute && brokerageFields.includes(annotation.attribute)) {
    return true
  }

  if (
    Array.isArray(annotation.attributes) &&
    annotation.attributes.some(attr => brokerageFields.includes(attr))
  ) {
    return true
  }

  return false
}
