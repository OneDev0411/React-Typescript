import { roleName } from 'deals/utils/roles'

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

  const list = attributes.map(attribute => {
    const text = attribute
      .split('.')
      .map(fraction => fraction.split('_').map(capitalize).join(' '))

    return text.slice(-2).join(' ')
  })

  const uniqList = [...new Set(list)]

  return uniqList.length > 1 ? `(${uniqList.join(' Or ')})` : uniqList[0]
}

function normalizeRoles(context, multiRoles) {
  return context.role
    .map(name => {
      const role = roleName(name)

      return multiRoles ? `${role}s` : role
    })
    .join(' or ')
}

export function getRoleTooltip(context, multiRoles = false) {
  const attribute = normalizeAttribute(context)
  const roles = normalizeRoles(context, multiRoles)

  if (multiRoles) {
    return `${attribute} of ${roles}`
  }

  return `${attribute} of ${ordinalNumbers[context.number]} ${roles}`
}
