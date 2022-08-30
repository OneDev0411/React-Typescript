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
import { operators } from './constant'

interface Props extends IFilterConfigRenderer {
  tt?: any
}

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
  onFilterChange,
  onToggleFilterActive
}: Props) => {
  const classes = useStyles()
  const [selectedOperator, setSelectedOperator] = useState<string>(
    () => operators.find(operator => operator.default)?.name ?? ''
  )
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleOperatorChange = event => {
    setSelectedOperator(event.target.value)
  }

  const handleApplyFilter = () => {
    const operator = operators.find(i => i.name === selectedOperator)

    if (!operator) {
      return
    }

    onFilterChange(
      [
        {
          label: fecha.format(selectedDate, 'MMM DD, YYYY'),
          value: selectedDate.getTime() / 1000
        }
      ],
      {
        name: operator.name,
        operator: operator.operator
      }
    )
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
            {!['all', 'any'].includes(operator.operator!) &&
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
