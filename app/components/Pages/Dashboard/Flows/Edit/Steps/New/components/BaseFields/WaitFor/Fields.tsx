import React, { useState } from 'react'

import {
  Theme,
  Select,
  Checkbox,
  MenuItem,
  makeStyles,
  OutlinedInput,
  FormControlLabel
} from '@material-ui/core'
import pluralize from 'pluralize'

import { RawWaitFor } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    fieldsContainer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      flexGrow: 1
    },
    value: {
      flexGrow: 1,
      maxWidth: '100px'
    },
    unit: {
      flexGrow: 1,
      padding: theme.spacing(0, 0.75)
    },
    triggerAt: {
      flexGrow: 1
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
  const [value, setValue] = useState<number>(baseValue.value || 1)
  const [unit, setUnit] = useState<WaitForField>(baseValue.unit)
  const [triggerAt, setTriggerAt] = useState<RawWaitFor['triggerAt']>(
    baseValue.triggerAt
  )
  const [isSameDayActive, setIsSameDayActive] = React.useState<boolean>(
    baseValue.value === 0
  )

  const handleSameDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    const sameDayState: RawWaitFor = {
      ...defaultWaitForValue,
      value: 0
    }

    setIsSameDayActive(isChecked)

    if (isChecked) {
      onChange(sameDayState)
    } else {
      onChange({ value, unit, triggerAt })
    }
  }

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
    <div className={classes.container}>
      <FormControlLabel
        disabled={disabled}
        control={
          <Checkbox
            checked={isSameDayActive}
            disabled={disabled}
            onChange={handleSameDayChange}
            name="sameDay"
          />
        }
        label="Same Day"
      />
      <div className={classes.fieldsContainer}>
        <div className={classes.value}>
          <OutlinedInput
            id="value"
            type="number"
            labelWidth={0}
            defaultValue={value}
            disabled={disabled || isSameDayActive}
            inputProps={{
              min: '1'
            }}
            classes={{
              input: classes.outlinedPadding
            }}
            onChange={handleValueChange}
          />
        </div>
        <div className={classes.unit}>
          <Select
            fullWidth
            labelId="event-unit"
            id="event-unit-select"
            variant="outlined"
            color="secondary"
            value={unit}
            disabled={disabled || isSameDayActive}
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
        </div>
        <div className={classes.triggerAt}>
          <Select
            fullWidth
            labelId="trigger-at"
            id="trigger-at-select"
            variant="outlined"
            color="secondary"
            value={triggerAt}
            disabled={disabled || isSameDayActive}
            onChange={handleTriggerAtChange}
            classes={{
              outlined: classes.outlinedPadding
            }}
          >
            <MenuItem value="after">After</MenuItem>
            <MenuItem value="before">Before</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  )
}
