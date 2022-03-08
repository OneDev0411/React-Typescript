const ordinalNumbers = [
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth',
  'Seventh',
  'Eighth',
  'Ninth',
  'Tenth'
]

function capitalize(text) {
  return text.replace(/^\w/, c => c.toUpperCase())
}

function normalizeAttribute(context) {
  const attributes = context.attributes || [context.attribute]

  console.log(context, attributes)

  const list = attributes.map(attribute => {
    const text = attribute
      .split('.')
      .map(fraction => fraction.split('_').map(capitalize).join(' '))

    return text.slice(-2).join(' ')
  })

  const uniqList = [...new Set(list)]

  return uniqList.length > 1 ? `(${uniqList.join(' Or ')})` : uniqList[0]
}

function normalizeRoles(dealRolesByName, context, multiRoles) {
  return context.role
    .map(name => {
      const role = dealRolesByName[name]?.title

      return multiRoles ? `${role}s` : role
    })
    .join(' or ')
}

export function getRoleTooltip(dealRolesByName, context, multiRoles = false) {
  const attribute = normalizeAttribute(context)
  const roles = normalizeRoles(dealRolesByName, context, multiRoles)

  if (multiRoles) {
    return `${attribute} of ${roles}`
  }

  return `${attribute} of ${ordinalNumbers[context.number]} ${roles}`
}
