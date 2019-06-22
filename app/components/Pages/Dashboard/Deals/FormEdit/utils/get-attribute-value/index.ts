import { get as getAttribute } from 'underscore.get'

import { getLegalFullName } from 'deals/utils/roles'

export function getAttributeValue(
  role: IDealRole,
  context: any,
  defaultValue = ''
): string {
  const attributes: string[] = context.attributes || [context.attribute]

  let value: string = ''

  attributes.some(attribute => {
    value =
      attribute === 'legal_full_name'
        ? getLegalFullName(role)
        : getAttribute(role, attribute, defaultValue)

    return value != null && value !== ''
  })

  return value && value.toString().trim()
}
