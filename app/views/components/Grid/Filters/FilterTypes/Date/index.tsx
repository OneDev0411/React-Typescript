import { useState } from 'react'

import {
  Theme,
  Radio,
  Button,
  Typography,
  RadioGroup,
  makeStyles,
  FormControlLabel
} from '@material-ui/core'

import { DateField } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/EditMode/Value/fields'
import {
  validateDateField,
  Values as DateFieldType
} from '@app/utils/validations/date-field'
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
    },
    error: {
      marginBottom: theme.spacing(1)
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
  const [error, setError] = useState<string>('')
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
    if (error) {
      setError('')
    }

    setSelectedDate(date)
  }

  const handleOperatorChange = event => {
    if (error) {
      setError('')
    }

    setSelectedOperator(event.target.value)
  }

  const handleApplyFilter = () => {
    const currentOperator = operators.find(i => i.name === selectedOperator)

    if (!currentOperator) {
      return
    }

    const shouldValidateValue = !operatorsWithNoValue.includes(
      currentOperator.name
    )
    const validateResult = shouldValidateValue
      ? validateDateField(getDateValues(selectedDate))
      : ''

    if (validateResult) {
      return setError(validateResult)
    }

    const payload = generatePayload(selectedDate!, currentOperator)

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
      {error && (
        <Typography color="error" variant="body2" className={classes.error}>
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={!!(!selectedOperator || error)}
        onClick={handleApplyFilter}
      >
        Done
      </Button>
    </div>
  )
}
