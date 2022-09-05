import { useState } from 'react'

import {
  Theme,
  Radio,
  Button,
  RadioGroup,
  makeStyles,
  FormControlLabel
} from '@material-ui/core'
import fecha from 'fecha'

import {
  convertDateToTimestamp,
  convertTimestampToDate
} from '@app/utils/date-utils'
import { Values as DateFieldType } from '@app/utils/validations/date-field'
import { parseDateValues } from '@app/views/components/inline-editable-fields/InlineDateField/helpers'

import { DateOperatorComponent } from './components/OperatorComponent'
import { operators, operatorsWithNoValue } from './constant'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      padding: theme.spacing(2)
    },
    typeContainer: {
      width: '100%',
      '&:not(:last-child)': {
        marginBottom: theme.spacing(1.5)
      }
    },
    typeTitle: {
      marginBottom: theme.spacing(1),
      borderBottom: 0,
      ...theme.typography.subtitle2
    }
  }),
  { name: 'DateFilterType' }
)
export const DateFilterType = ({
  values,
  operator,
  onFilterChange,
  onToggleFilterActive
}: IFilterConfigRenderer) => {
  const classes = useStyles()
  const [selectedOperator, setSelectedOperator] = useState<string>(
    () =>
      operator?.name ?? operators.find(operator => operator.default)?.name ?? ''
  )
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (Array.isArray(values) && typeof values[0].value === 'number') {
      return convertTimestampToDate(values[0].value)
    }

    return new Date()
  })

  const handleDateChange = (date: DateFieldType) => {
    const newSelectedDate =
      convertTimestampToDate(parseDateValues(date)!) ?? selectedDate

    newSelectedDate.setUTCHours(0, 0, 0, 0)

    setSelectedDate(newSelectedDate)
  }

  const handleOperatorChange = event => {
    setSelectedOperator(event.target.value)
  }

  const handleApplyFilter = () => {
    const currentOperator = operators.find(i => i.name === selectedOperator)

    if (!currentOperator) {
      return
    }

    const payload = operatorsWithNoValue.includes(currentOperator.name)
      ? {
          label: '',
          value: null
        }
      : {
          label: fecha.format(selectedDate, 'MMM DD, YYYY'),
          value: convertDateToTimestamp(selectedDate)
        }

    onFilterChange([payload], currentOperator)
    onToggleFilterActive()
  }

  return (
    <div className={classes.container}>
      <RadioGroup
        name="date"
        value={selectedOperator}
        onChange={handleOperatorChange}
      >
        {operators.map(operator => (
          <div key={operator.name}>
            <FormControlLabel
              key={operator.name}
              value={operator.name}
              control={<Radio size="small" color="primary" />}
              label={operator.name}
            />
            {!operatorsWithNoValue.includes(operator.name) &&
              selectedOperator === operator.name && (
                <DateOperatorComponent
                  currentValue={convertDateToTimestamp(selectedDate)}
                  onChange={handleDateChange}
                />
              )}
          </div>
        ))}
      </RadioGroup>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleApplyFilter}
      >
        Done
      </Button>
    </div>
  )
}
