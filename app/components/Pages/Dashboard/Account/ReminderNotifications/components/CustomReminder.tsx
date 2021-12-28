import { useState } from 'react'

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

interface SelectOption {
  label: string
  value: number
}

const daysOption: SelectOption = {
  label: 'Days',
  value: ONE_DAY_IN_SECONDS
}
const weeksOption: SelectOption = {
  label: 'Weeks',
  value: ONE_WEEK_IN_SECONDS
}
const options: SelectOption[] = [daysOption, weeksOption]

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
  const classes = useStyles()

  // The seconds prop does not include enough data to decide about display mode (days/weeks).
  // We should decide about its initial state when the component is mounted based on input seconds
  // and then update the state on the select input changes.
  const [displayMode, setDisplayMode] = useState<SelectOption>(() => {
    const initiallyInWeeks = doSecondsRepresentWeeks(seconds)
    const displayMode = initiallyInWeeks ? weeksOption : daysOption

    return displayMode
  })

  const fieldValue =
    displayMode.label === 'Weeks'
      ? getWeeksFromSeconds(seconds)
      : getDaysFromSeconds(seconds)

  const getSeconds = (
    anotherOption?: typeof options[number],
    anotherValue?: number
  ) => {
    const option = anotherOption ?? displayMode
    const value = anotherValue ?? fieldValue

    return value * option.value
  }

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.inputContainer}>
        <TextField
          value={String(fieldValue)}
          variant="outlined"
          onChange={({ target: { value } }) => {
            const isValid = /^\d{0,3}$/.test(value)

            if (isValid) {
              onChange(getSeconds(displayMode, Number(value)))
            }
          }}
          inputProps={{ className: classes.input }}
        />
      </Grid>
      <Grid item className={classes.dropdownContainer}>
        <Select
          variant="outlined"
          fullWidth
          value={displayMode.value}
          onChange={({ target: { value } }) => {
            const option = options.find(option => option.value === value)!

            setDisplayMode(option)
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
