import { getField } from '../get-field'

export function getPrice(deal) {
  return (
    getField(deal, 'sales_price') ||
    getField(deal, 'list_price') ||
    getField(deal, 'lease_price')
  )
}
