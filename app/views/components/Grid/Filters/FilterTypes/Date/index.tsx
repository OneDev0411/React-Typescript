import { useState } from 'react'

import {
  Theme,
  Radio,
  Button,
  RadioGroup,
  makeStyles,
  FormControlLabel
} from '@material-ui/core'

import { DateField } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/EditMode/Value/fields'
import { Values as DateFieldType } from '@app/utils/validations/date-field'
import { getDateValues } from '@app/views/components/inline-editable-fields/InlineDateField/helpers'

import { operators, operatorsWithNoValue } from './constant'
import { generatePayload } from './helpers/generate-payload'

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
  const [selectedOperator, setSelectedOperator] = useState<string>(() => {
    return (
      operator?.name ?? operators.find(operator => operator.default)?.name ?? ''
    )
  })
  const [selectedDate, setSelectedDate] = useState<Nullable<DateFieldType>>(
    () => {
      if (Array.isArray(values) && typeof values[0].value === 'number') {
        return getDateValues(values[0].value)
      }

      return null
    }
  )

  const handleDateChange = (date: DateFieldType) => {
    setSelectedDate(date)
  }

  const handleOperatorChange = event => {
    setSelectedOperator(event.target.value)
  }

  const handleApplyFilter = () => {
    const currentOperator = operators.find(i => i.name === selectedOperator)

    if (!currentOperator || !selectedDate) {
      return
    }

    const payload = generatePayload(selectedDate, currentOperator)

    onFilterChange(payload, currentOperator)
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
                <DateField onChange={handleDateChange} value={selectedDate} />
              )}
          </div>
        ))}
      </RadioGroup>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={!selectedOperator}
        onClick={handleApplyFilter}
      >
        Done
      </Button>
    </div>
  )
}
