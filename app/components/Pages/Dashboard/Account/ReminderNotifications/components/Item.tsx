import React, { useState, useEffect, useCallback } from 'react'
import {
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Theme
} from '@material-ui/core'
import { mdiBellOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ONE_DAY_IN_SECONDS, ONE_WEEK_IN_SECONDS } from '../constants'

import CustomReminder from './CustomReminder'

const zeroOption = {
  label: 'Day of',
  value: 0
} as const
const customOption = {
  label: 'Custom',
  value: 'CUSTOM'
} as const
const options = [
  zeroOption,
  {
    label: '1 day before',
    value: ONE_DAY_IN_SECONDS
  },
  {
    label: '2 days before',
    value: 2 * ONE_DAY_IN_SECONDS
  },
  {
    label: '3 days before',
    value: 3 * ONE_DAY_IN_SECONDS
  },
  {
    label: '1 week before',
    value: ONE_WEEK_IN_SECONDS
  },
  {
    label: '2 weeks before',
    value: 2 * ONE_WEEK_IN_SECONDS
  },
  customOption
] as const

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(4)
    },
    select: {
      width: theme.spacing(25)
    },
    marginedText: {
      marginLeft: theme.spacing(1.5)
    }
  }),
  { name: 'ReminderNotifications-Item' }
)

interface Props {
  label: string
  selected: boolean
  reminderSeconds: number
  onChange: (selected: boolean, reminderSeconds: number) => void
}

export default function Item({
  label,
  selected,
  reminderSeconds,
  onChange
}: Props) {
  const [option, setOption] = useState(
    () => options.find(({ value }) => value === reminderSeconds) || customOption
  )

  const getReminderSeconds = useCallback(() => {
    return option === customOption ? reminderSeconds : (option.value as number)
  }, [reminderSeconds, option])

  useEffect(() => {
    if (!selected) {
      setOption(zeroOption)
    } else if (reminderSeconds !== getReminderSeconds()) {
      setOption(
        options.find(({ value }) => value === reminderSeconds) ?? customOption
      )
    }
  }, [selected, reminderSeconds, getReminderSeconds])

  const classes = useStyles()

  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item>
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              checked={selected}
              onChange={(event, checked) =>
                onChange(checked, checked ? reminderSeconds : 0)
              }
            />
          }
        />
      </Grid>

      <Grid item>
        <Select
          variant="outlined"
          className={classes.select}
          disabled={!selected}
          value={option.value}
          onChange={({ target: { value } }) => {
            const option = options.find(option => option.value === value)!

            setOption(option)

            if (option !== customOption) {
              onChange(selected, option.value as number)
            }
          }}
          renderValue={value => {
            const option = options.find(option => option.value === value)!

            return (
              <>
                <SvgIcon path={mdiBellOutline} size={muiIconSizes.small} />
                <span className={classes.marginedText}>{option.label}</span>
              </>
            )
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      {option === customOption && (
        <Grid item>
          <CustomReminder
            seconds={reminderSeconds}
            onChange={seconds => onChange(selected, seconds)}
          />
        </Grid>
      )}
    </Grid>
  )
}
