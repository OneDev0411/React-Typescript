import { ROLE_NAMES } from 'deals/utils/roles'

import { isValidCommission } from './is-valid-commission'
import { isValidEmail } from './is-valid-email'
import { isValidLegalPrefix } from './is-valid-legal-prefix'
import { isValidPhoneNumber } from './is-valid-phone'
import { isValidString } from './is-valid-string'
import { isValidAddress } from './is-valid-address'
import { isValidNumber } from './is-valid-number'

/**
 * get form validators
 */
export function getFormValidators(requiredFields) {
  return {
    /* validate role */
    role: role => ROLE_NAMES.includes(role),

    /* validate Current Address */
    current_address: value =>
      isValidAddress(value, requiredFields, 'current_address'),

    /* validate Future Address */
    future_address: value =>
      isValidAddress(value, requiredFields, 'future_address'),

    /* validate MLS ID */
    mls_id: value => isValidString(value, requiredFields, 'mls_id'),

    /* validate Legal Prefix */
    legal_prefix: value => isValidLegalPrefix(value, requiredFields),

    /* validate Legal Last Name */
    legal_last_name: name =>
      isValidString(name, requiredFields, 'legal_last_name'),

    /* validate Legal Middle Name */
    legal_middle_name: name =>
      isValidString(name, requiredFields, 'legal_middle_name'),

    /* validate Legal First Name */
    legal_first_name: name =>
      isValidString(name, requiredFields, 'legal_first_name'),

    /* validate Company Title */
    company_title: name => isValidString(name, requiredFields, 'company_title'),

    /* validate Email */
    email: email => isValidEmail(email, requiredFields, 'email'),

    /* validate Phone Number */
    phone_number: phoneNumber =>
      isValidPhoneNumber(phoneNumber, requiredFields, 'phone_number'),

    /* validate Commission */
    commission: value => isValidCommission(value, requiredFields),

    /* validate Office Email */
    office_email: name => isValidEmail(name, requiredFields, 'office_email'),

    /* validate Office Lisence Number */
    office_license_number: name =>
      isValidString(name, requiredFields, 'office_license_number'),

    /* validate Office MLS ID */
    office_mls_id: name => isValidString(name, requiredFields, 'office_mls_id'),

    /* validate  Office Name */
    office_name: name => isValidString(name, requiredFields, 'office_name'),

    /* validate Office Phone */
    office_phone: name =>
      isValidPhoneNumber(name, requiredFields, 'office_phone'),
    /* validate Office Fax */
    office_fax: name => isValidPhoneNumber(name, requiredFields, 'office_fax'),

    /* validate Office Address */
    office_address: value => isValidAddress(value, requiredFields)
  }
}
