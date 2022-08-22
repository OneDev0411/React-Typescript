import { useState, useMemo } from 'react'

import {
  Theme,
  Radio,
  Button,
  FormLabel,
  RadioGroup,
  makeStyles,
  FormControl,
  FormControlLabel
} from '@material-ui/core'
import _groupBy from 'lodash/groupBy'

import { OperatorComponent } from './components/OperatorComponent'
import { operators } from './constant'

interface Props extends IFilterConfigRenderer {
  tt?: any
}

const groupedOperator = _groupBy(operators, 'type')
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
export const DateFilterType = (props: Props) => {
  // console.log({ groupedOperator })
  const classes = useStyles()
  const [selectedOperator, setSelectedOperator] = useState('female')

  const handleOperatorChange = event => {
    // console.log({ value: event.target.value })

    setSelectedOperator(event.target.value)
  }

  return (
    <div className={classes.container}>
      {Object.entries(groupedOperator).map(([type, operators]) => (
        <FormControl
          key={type}
          component="fieldset"
          className={classes.typeContainer}
        >
          <FormLabel component="legend" className={classes.typeTitle}>
            {type.toUpperCase()}
          </FormLabel>
          <RadioGroup
            name="date"
            value={selectedOperator}
            onChange={handleOperatorChange}
          >
            {operators.map(operator => (
              <>
                <FormControlLabel
                  key={operator.name}
                  value={operator.name}
                  control={<Radio size="small" color="primary" />}
                  label={operator.name}
                />
                {!['all', 'any'].includes(operator.operator) &&
                  selectedOperator === operator.name && (
                    <OperatorComponent operator={operator} />
                  )}
              </>
            ))}
          </RadioGroup>
        </FormControl>
      ))}
      <Button fullWidth variant="contained" color="primary">
        Done
      </Button>
    </div>
  )
}
