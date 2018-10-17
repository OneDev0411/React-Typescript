import { roleName } from '../../../utils/roles'

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
  const { attribute } = context

  const text = attribute.split('.').map(fraction =>
    fraction
      .split('_')
      .map(part => capitalize(part))
      .join(' ')
  )

  return text.slice(-2).join(' ')
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
