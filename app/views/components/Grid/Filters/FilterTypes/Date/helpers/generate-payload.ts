import { format, parse } from 'fecha'

import {
  convertDateToTimestamp,
  convertTimestampToDate
} from '@app/utils/date-utils'
import { Values as DateFieldType } from '@app/utils/validations/date-field'
import { parseDateValues } from '@app/views/components/inline-editable-fields/InlineDateField/helpers'

import { operatorsWithNoValue } from '../constant'

export const generatePayload = (
  date: DateFieldType,
  operator: IFilterOperator
): ILabelValue[] => {
  if (operatorsWithNoValue.includes(operator.name)) {
    return [
      {
        label: '',
        value: null
      }
    ]
  }

  const newDate = convertTimestampToDate(parseDateValues(date)!)
  const dateFormat = date.year ? 'MMM DD, YYYY' : 'MMM DD'

  newDate.setUTCHours(0, 0, 0, 0)

  return [
    {
      label: format(
        parse(newDate.toUTCString(), 'longDate') as Date,
        dateFormat
      ),
      value: convertDateToTimestamp(newDate)
    }
  ]
}
