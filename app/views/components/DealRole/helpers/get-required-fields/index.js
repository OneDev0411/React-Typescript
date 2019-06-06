import memoize from 'lodash/memoize'

import { TYPE_PERSON, TYPE_COMPANY } from '../../constants/role-types'

/**
 * check whether commission is required or not
 * it's required by default
 * https://gitlab.com/rechat/web/issues/691
 * https://gitlab.com/rechat/web/issues/760
 */
function getIsCommissionRequired(args) {
  const { role, deal, visibleFields, isCommissionRequired } = args

  if (deal && deal.deal_type === 'Buying' && role === 'SellerAgent') {
    return false
  }

  return visibleFields.includes('commission') && isCommissionRequired
}

/**
 * check email is required or not
 * https://gitlab.com/rechat/web/issues/563
 */
function getIsEmailRequired(args) {
  return (
    args.isEmailRequired || ['BuyerAgent', 'SellerAgent'].includes(args.role)
  )
}

/**
 * check company is required or not
 * see https://gitlab.com/rechat/web/issues/1217
 */
function getIsCompanyRequired(args) {
  const { deal, dealSide, role } = args

  let otherSideAgents = []
  const side = deal ? deal.deal_type : dealSide

  if (!side) {
    return false
  }

  if (side === 'Selling') {
    otherSideAgents = ['BuyerAgent', 'CoBuyerAgent']
  }

  if (side === 'Buying') {
    otherSideAgents = ['SellerAgent', 'CoSellerAgent']
  }

  return otherSideAgents.includes(role)
}

export default function getRequiredFields(args) {
  const { role, role_type } = args

  // role and role_type are always mandatory
  const list = ['role', 'role_type']

  if (role_type === TYPE_PERSON) {
    list.push('legal_first_name', 'legal_last_name')
  }

  if (role_type === TYPE_COMPANY || (role && role.includes('Agent'))) {
    list.push('company_title')
  }

  if (getIsEmailRequired(args)) {
    list.push('email')
  }

  if (getIsCommissionRequired(args)) {
    list.push('commission')
  }

  if (getIsCompanyRequired(args)) {
    list.push('company_title')
  }

  /**
   * Required fields for EscrowOfficer according to web#1192
   * https://gitlab.com/rechat/web/issues/1192
   */
  if (role === 'Title') {
    list.push(
      'legal_first_name',
      'legal_last_name',
      'company_title',
      'email',
      'phone_number'
    )
  }

  // unique array
  return [...new Set(list)]
}
