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
    if (Array.isArray(values) && values[0].value) {
      return new Date((values[0].value as number) * 1000)
    }

    return new Date()
  })

  const handleOperatorChange = event => {
    setSelectedOperator(event.target.value)
  }

  const handleApplyFilter = () => {
    const currentOperator = operators.find(i => i.name === selectedOperator)

    if (!currentOperator) {
      return
    }

    selectedDate.setUTCHours(0, 0, 0, 0)

    const payload = operatorsWithNoValue.includes(currentOperator.name)
      ? {
          label: '',
          value: null
        }
      : {
          label: fecha.format(selectedDate, 'MMM DD, YYYY'),
          value: selectedDate.getTime() / 1000
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
                  currentValue={selectedDate}
                  onChange={setSelectedDate}
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
