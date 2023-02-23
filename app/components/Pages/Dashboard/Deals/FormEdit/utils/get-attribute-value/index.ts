import { get as getAttribute } from 'underscore.get'

import { getLegalFullName } from 'deals/utils/roles'
import { formatPhoneNumber } from 'utils/format'

export function getAttributeValue(
  role: IDealRole,
  context: any,
  defaultValue = ''
): string {
  const attributes: string[] = context.attributes || [context.attribute]

  let value: string = ''

  attributes.some(attribute => {
    if (attribute === 'legal_full_name') {
      value = getLegalFullName(role)
    } else {
      value = getAttribute(role, attribute, defaultValue)

      if (
        [
          'phone_number',
          'office_phone',
          'office_fax',
          'work_phone',
          'fax',
          'office_phone',
          'fax'
        ].includes(attribute)
      ) {
        value = formatPhoneNumber(value)
      }
    }

    return value != null && value !== ''
  })

  return value && value.toString().trim()
}
