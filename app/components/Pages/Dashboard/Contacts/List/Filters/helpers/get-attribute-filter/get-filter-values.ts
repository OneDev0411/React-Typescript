import fecha from 'fecha'

import { convertTimestampToDate } from '@app/utils/date-utils'
import { getDateValues } from '@app/views/components/inline-editable-fields/InlineDateField/helpers'

import { ORIGINS } from '../../../constants'

const payloadGenerator = (value: any, label: string) => [
  {
    label,
    value
  }
]

export const getFilterValues = (
  value: any,
  attribute: IContactAttributeDef
): IActiveFilter['values'] => {
  if (attribute.data_type === 'date') {
    const dateValue = getDateValues(value)
    const dateFormat = dateValue.year ? 'MMM DD, YYYY' : 'MMM DD'
    const label = fecha.format(convertTimestampToDate(value), dateFormat)

    return payloadGenerator(value, label)
  }

  const origins = ORIGINS
  const nextLabel = origins.find(item => item.value === value)?.label ?? value

  return payloadGenerator(value, nextLabel)
}
