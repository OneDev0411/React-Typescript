const aliases = {
  Title: 'Closing Officer',
  Lender: 'Lending Agent'
}

export default function (role) {
  const name = aliases[role] || role

  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/Co\s/g, 'Co-')
}
