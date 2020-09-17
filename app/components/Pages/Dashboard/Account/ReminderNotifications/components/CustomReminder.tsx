import React, { useState, useLayoutEffect } from 'react'
import { makeStyles, Theme, TextField } from '@material-ui/core'

import { BasicDropdown } from 'components/BasicDropdown'

import { oneDayInSeconds, oneWeekInSeconds } from '../constants'

import { doSecondsRepresentWeeks } from '../helpers/do-seconds-represent-weeks'
import { getWeeksFromSeconds } from '../helpers/get-weeks-from-seconds'
import { getDaysFromSeconds } from '../helpers/get-days-from-seconds'

const daysOption = {
  label: 'Days',
  value: oneDayInSeconds
} as const
const weeksOption = {
  label: 'Weeks',
  value: oneWeekInSeconds
} as const
const options = [daysOption, weeksOption] as const

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      padding: theme.spacing(2, 0)
    },
    inputContainer: {
      width: theme.spacing(6),
      marginRight: theme.spacing(2),
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1.2, 1),
        textAlign: 'center'
      }
    },
    dropdownContainer: {
      width: theme.spacing(14)
    }
  }),
  { name: 'ReminderNotifications-CustomValue' }
)

interface Props {
  seconds: number
  onChange: (seconds: number) => void
}

export default function CustomReminder({ seconds, onChange }: Props) {
  const initiallyInWeeks = doSecondsRepresentWeeks(seconds)
  const initialOption = initiallyInWeeks ? weeksOption : daysOption
  const initialValue = initiallyInWeeks
    ? getWeeksFromSeconds(seconds)
    : getDaysFromSeconds(seconds)

  const [option, setOption] = useState(initialOption)
  const [value, setValue] = useState(initialValue)

  function getSeconds(anotherOption?: typeof options[number]): number {
    const selectedOption = anotherOption ?? option

    return value * selectedOption.value
  }

  useLayoutEffect(() => {
    if (seconds !== getSeconds()) {
      setOption(initialOption)
      setValue(initialValue)
    }
  }, [seconds])

  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.inputContainer}>
        <TextField
          value={String(value)}
          variant="outlined"
          onChange={event => {
            const rawValue = event.target.value
            const isValid = /^\d{0,3}$/.test(rawValue)

            if (isValid) {
              setValue(Number(rawValue))
            }
          }}
          onBlur={() => onChange(getSeconds())}
        />
      </div>
      <div className={classes.dropdownContainer}>
        <BasicDropdown
          fullWidth
          fullHeight
          items={options}
          selectedItem={option}
          onSelect={(option: typeof options[number]) => {
            setOption(option)
            onChange(getSeconds(option))
          }}
        />
      </div>
    </div>
  )
}
