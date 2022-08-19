import { useState, useMemo } from 'react'

import {
  Theme,
  Radio,
  FormLabel,
  RadioGroup,
  makeStyles,
  FormControl,
  FormControlLabel
} from '@material-ui/core'
import _groupBy from 'lodash/groupBy'

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
  const [value, setValue] = useState('female')

  const handleChange = event => {
    setValue(event.target.value)
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
          <RadioGroup name="date" value={value} onChange={handleChange}>
            {operators.map(operator => (
              <FormControlLabel
                key={operator.name}
                value={operator.name}
                control={<Radio size="small" color="primary" />}
                label={operator.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ))}
    </div>
  )
}
