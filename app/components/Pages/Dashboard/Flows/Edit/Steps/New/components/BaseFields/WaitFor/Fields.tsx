import React, { useState } from 'react'

import {
  Box,
  OutlinedInput,
  MenuItem,
  Select,
  makeStyles,
  Theme
} from '@material-ui/core'
import pluralize from 'pluralize'

import { RawWaitFor } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap'
    },
    outlinedPadding: {
      padding: theme.spacing(1.3, 1.75)
    }
  }),
  { name: 'WaitForFields' }
)
const unitOptions = [
  {
    title: 'Hour',
    value: 'hours'
  },
  {
    title: 'Day',
    value: 'days'
  },
  {
    title: 'Week',
    value: 'weeks'
  },
  {
    title: 'Month',
    value: 'months'
  },
  {
    title: 'Year',
    value: 'years'
  }
]

export const defaultWaitForValue: RawWaitFor = {
  value: 1,
  unit: 'days',
  triggerAt: 'after'
}

interface Props {
  disabled: boolean
  value: RawWaitFor
  onChange: (value: RawWaitFor) => void
}

export const WaitForFields = ({
  value: baseValue = defaultWaitForValue,
  disabled,
  onChange
}: Props) => {
  const classes = useStyles()
  const [value, setValue] = useState<number>(baseValue.value)
  const [unit, setUnit] = useState<WaitForField>(baseValue.unit)
  const [triggerAt, setTriggerAt] = useState<RawWaitFor['triggerAt']>(
    baseValue.triggerAt
  )
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)

    setValue(value)
    onChange({ ...baseValue, value })
  }

  const handleUnitChange = (
    event: React.ChangeEvent<{ value: WaitForField }>
  ) => {
    const value = event.target.value

    setUnit(value)
    onChange({ ...baseValue, unit: value })
  }

  const handleTriggerAtChange = (
    event: React.ChangeEvent<{ value: RawWaitFor['triggerAt'] }>
  ) => {
    const value = event.target.value

    setTriggerAt(value)
    onChange({ ...baseValue, triggerAt: value })
  }

  return (
    <Box className={classes.container}>
      <Box flexGrow={1} maxWidth={65}>
        <OutlinedInput
          id="value"
          type="number"
          labelWidth={0}
          defaultValue={value}
          disabled={disabled}
          inputProps={{
            min: '1'
          }}
          classes={{
            input: classes.outlinedPadding
          }}
          onChange={handleValueChange}
        />
      </Box>
      <Box flexGrow={1} px={0.75}>
        <Select
          fullWidth
          labelId="event-unit"
          id="event-unit-select"
          variant="outlined"
          color="secondary"
          value={unit}
          disabled={disabled}
          onChange={handleUnitChange}
          classes={{
            outlined: classes.outlinedPadding
          }}
        >
          {unitOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {pluralize(option.title, value)}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box flexGrow={1}>
        <Select
          fullWidth
          labelId="trigger-at"
          id="trigger-at-select"
          variant="outlined"
          color="secondary"
          value={triggerAt}
          disabled={disabled}
          onChange={handleTriggerAtChange}
          classes={{
            outlined: classes.outlinedPadding
          }}
        >
          <MenuItem value="after">After</MenuItem>
          <MenuItem value="before">Before</MenuItem>
        </Select>
      </Box>
    </Box>
  )
}
