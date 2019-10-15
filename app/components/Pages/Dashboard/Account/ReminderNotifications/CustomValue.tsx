import React, { useState, useCallback } from 'react'
import { TextField } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { BasicDropdown } from 'components/BasicDropdown'
import { DropdownItem } from 'components/Dropdown/types'

const ONE_WEEK_IN_SECONDS = 604800
const ONE_DAY_IN_SECONDS = 86400

function getWeeks(seconds: number): number {
  if (seconds % ONE_WEEK_IN_SECONDS === 0) {
    return seconds / ONE_WEEK_IN_SECONDS
  }

  return 0
}

function getDays(seconds: number): number {
  return seconds / ONE_DAY_IN_SECONDS
}

const DROPDOWN_OPTIONS: DropdownItem[] = [
  {
    label: 'Days',
    value: ONE_DAY_IN_SECONDS
  },
  {
    label: 'Weeks',
    value: ONE_WEEK_IN_SECONDS
  }
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customValueContainer: {
      display: 'flex',
      padding: theme.spacing(2, 0)
    },
    customValueInputContainer: {
      width: '3rem',
      marginRight: '1rem',
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1.2, 1),
        textAlign: 'center'
      }
    },
    customValueDropdownContainer: {
      width: '7rem'
    }
  })
)

interface Props {
  value: number
  onChange: (value: number) => unknown
}

export default function CustomValue(props: Props) {
  const classes = useStyles()

  const weeks = getWeeks(props.value)
  const days = getDays(props.value)

  const [value, setValue] = useState(weeks || days)

  const [selectedItem, setSelectedItem] = useState(
    weeks ? DROPDOWN_OPTIONS[1] : DROPDOWN_OPTIONS[0]
  )

  const handleChange = useCallback(() => {
    props.onChange(value * selectedItem.value)
  }, [props, selectedItem, value])

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item)
    handleChange()
  }

  return (
    <div className={classes.customValueContainer}>
      <div className={classes.customValueInputContainer}>
        <TextField
          value={value}
          variant="outlined"
          onChange={e => setValue(Number(e.target.value))}
          onBlur={handleChange}
        />
      </div>
      <div className={classes.customValueDropdownContainer}>
        <BasicDropdown
          fullWidth
          fullHeight
          items={DROPDOWN_OPTIONS}
          selectedItem={selectedItem}
          onSelect={handleSelect}
        />
      </div>
    </div>
  )
}
