import { isValidCommission } from './is-valid-commission'
import { isValidEmail } from './is-valid-email'
import { isValidLegalPrefix } from './is-valid-legal-prefix'
import { isValidPhoneNumber } from './is-valid-phone'
import { isValidString } from './is-valid-string'
import { isValidNumber } from './is-valid-number'

/**
 * get form validators
 */
export function getFormValidators(requiredFields) {
  return {
    role: role => role,
    current_address: value => isValidString(value, requiredFields),
    future_address: value => isValidString(value, requiredFields),
    mls_id: value => isValidNumber(value, requiredFields),
    legal_prefix: value => isValidLegalPrefix(value, requiredFields),
    legal_last_name: name =>
      isValidString(name, requiredFields, 'legal_last_name'),
    legal_middle_name: name =>
      isValidString(name, requiredFields, 'legal_middle_name'),
    legal_first_name: name =>
      isValidString(name, requiredFields, 'legal_first_name'),
    company_title: name => isValidString(name, requiredFields, 'company_title'),
    email: email => isValidEmail(email, requiredFields),
    phone_number: phoneNumber =>
      isValidPhoneNumber(phoneNumber, requiredFields),
    commission: value => isValidCommission(value, requiredFields)
  }
}
