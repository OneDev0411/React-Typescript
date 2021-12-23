import React, { useMemo } from 'react'

import {
  makeStyles,
  Theme,
  TextField,
  Grid,
  Select,
  MenuItem
} from '@material-ui/core'

import { ONE_DAY_IN_SECONDS, ONE_WEEK_IN_SECONDS } from '../constants'
import { doSecondsRepresentWeeks } from '../helpers/do-seconds-represent-weeks'
import { getDaysFromSeconds } from '../helpers/get-days-from-seconds'
import { getWeeksFromSeconds } from '../helpers/get-weeks-from-seconds'

const daysOption = {
  label: 'Days',
  value: ONE_DAY_IN_SECONDS
} as const
const weeksOption = {
  label: 'Weeks',
  value: ONE_WEEK_IN_SECONDS
} as const
const options = [daysOption, weeksOption] as const

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      marginTop: theme.spacing(2)
    },
    inputContainer: {
      width: theme.spacing(9),
      marginRight: theme.spacing(2)
    },
    input: {
      textAlign: 'center'
    },
    dropdownContainer: {
      width: theme.spacing(14)
    }
  }),
  { name: 'ReminderNotifications-CustomReminder' }
)

interface Props {
  seconds: number
  onChange: (seconds: number) => void
}

export default function CustomReminder({ seconds, onChange }: Props) {
  const { selectedOption, fieldValue } = useMemo(() => {
    const initiallyInWeeks = doSecondsRepresentWeeks(seconds)
    const selectedOption = initiallyInWeeks ? weeksOption : daysOption
    const fieldValue = initiallyInWeeks
      ? getWeeksFromSeconds(seconds)
      : getDaysFromSeconds(seconds)

    return { selectedOption, fieldValue }
  }, [seconds])

  const getSeconds = (
    anotherOption?: typeof options[number],
    anotherValue?: number
  ) => {
    const option = anotherOption ?? selectedOption
    const value = anotherValue ?? fieldValue

    return value * option.value
  }

  const classes = useStyles()

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.inputContainer}>
        <TextField
          value={String(fieldValue)}
          variant="outlined"
          onChange={({ target: { value } }) => {
            const isValid = /^\d{0,3}$/.test(value)

            if (isValid) {
              onChange(getSeconds(selectedOption, Number(value)))
            }
          }}
          inputProps={{ className: classes.input }}
        />
      </Grid>
      <Grid item className={classes.dropdownContainer}>
        <Select
          variant="outlined"
          fullWidth
          value={selectedOption.value}
          onChange={({ target: { value } }) => {
            const option = options.find(option => option.value === value)!

            onChange(getSeconds(option))
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  )
}
