export function getClientNames(deal, roles) {
  const allowedRoles =
    deal.deal_type === 'Buying' ? ['Buyer', 'Tenant'] : ['Seller', 'Landlord']
  const clients = []

  if (!deal.roles || !roles) {
    return ''
  }

  deal.roles.forEach(role => {
    let item = roles[role]

    if (allowedRoles.indexOf(item.role) > -1) {
      if (item.user) {
        clients.push(item.user.display_name)
      } else {
        clients.push(`${item.legal_first_name} ${item.legal_last_name}`)
      }
    }
  })

  return clients.join(', ')
}
