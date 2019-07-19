/**
 * returns commission attributes
 */
export function getCommissionAttributes(form) {
  if (form && form.commission_percentage !== null) {
    return {
      commission: form.commission_percentage,
      commission_type: 'commission_percentage'
    }
  }

  if (form && form.commission_dollar !== null) {
    return {
      commission: form.commission_dollar,
      commission_type: 'commission_dollar'
    }
  }

  return {
    commission: '',
    commission_type: 'commission_percentage'
  }
}
