export function getRecipientPlaceholders(): Partial<IContact> {
  return {
    profile_image_url: '{{recipient.profile_image_url}}',
    display_name: '{{recipient.display_name}}',
    first_name: '{{recipient.first_name}}',
    middle_name: '{{recipient.middle_name}}',
    last_name: '{{recipient.last_name}}',
    phone_number: '{{recipient.phone_number}}',
    email: '{{recipient.email}}',
    company: '{{recipient.company}}',
    partner_email: '{{recipient.partner_email}}',
    partner_first_name: '{{recipient.partner_first_name}}',
    partner_last_name: '{{recipient.partner_last_name}}',
    partner_name: '{{recipient.partner_name}}'
  }
}
