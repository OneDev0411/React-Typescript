import { TYPE_PERSON } from '../../constants/role-types'

export default function getVisibleFields(args) {
  const list = ['company_title', 'email', 'phone_number']

  if (args.role_type === TYPE_PERSON) {
    list.push(
      'title',
      'legal_prefix',
      'legal_first_name',
      'legal_middle_name',
      'legal_last_name'
    )
  }

  if (args.isFirstNameRequired) {
    list.push('legal_first_name')
  }

  if (args.isLastNameRequired) {
    list.push('legal_last_name')
  }

  if (
    [
      'CoBuyerAgent',
      'BuyerAgent',
      'BuyerReferral',
      'CoSellerAgent',
      'SellerAgent',
      'SellerReferral'
    ].includes(args.role)
  ) {
    list.push('commission')
  }

  if (
    ['SellerAgent', 'CoSellerAgent', 'BuyerAgent', 'CoBuyerAgent'].includes(
      args.role
    )
  ) {
    list.push('mls_id')
  }

  if (['Seller', 'Buyer'].includes(args.role)) {
    list.push('current_address', 'future_address')
  }

  /**
   * https://gitlab.com/rechat/web/issues/1192
   */
  if (args.role === 'Title') {
    list.push('legal_first_name', 'legal_last_name')
  }

  // unique array
  return [...new Set(list)]
}
