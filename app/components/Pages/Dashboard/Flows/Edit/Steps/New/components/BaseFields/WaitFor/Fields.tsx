import React, { useState } from 'react'

import {
  Theme,
  Select,
  MenuItem,
  makeStyles,
  OutlinedInput,
  FormControlLabel,
  Typography,
  Radio,
  FormControl
} from '@material-ui/core'
import pluralize from 'pluralize'

import { RawWaitFor } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    fieldsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'nowrap'
    },
    separator: {
      color: theme.palette.grey[500]
    },
    value: {
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

  const handleSameDayChange = (isSameDay: boolean) => {
    const sameDayState: RawWaitFor = {
      ...defaultWaitForValue,
      value: 0
    }

    setIsSameDayActive(isSameDay)

    if (isSameDay) {
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
          <Radio
            checked={isSameDayActive}
            disabled={disabled}
            onChange={() => handleSameDayChange(true)}
            name="sameDay"
          />
        }
        label="Same Day / ASAP"
      />
      <Typography className={classes.separator} variant="body2">
        OR
      </Typography>
      <FormControl
        className={classes.fieldsContainer}
        onClick={() => handleSameDayChange(false)}
      >
        <Radio checked={!isSameDayActive} disabled={disabled} name="sameDay" />

        <div className={classes.value}>
          <FormControl>
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
          </FormControl>
        </div>

        <div className={classes.unit}>
          <FormControl>
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
          </FormControl>
        </div>
        <div className={classes.triggerAt}>
          <FormControl>
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
          </FormControl>
        </div>
      </FormControl>
    </div>
  )
}
