import React from 'react'
import { MenuItem } from '@material-ui/core'
import cn from 'classnames'

import { BaseDropdown } from 'components/BaseDropdown'

import { useStyles } from '../use-styles'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

interface Props {
  date: Date
  onChange: (value: number) => void
}

export function Month({ date, onChange }: Props) {
  const classes = useStyles()

  return (
    <BaseDropdown
      buttonLabel={MONTHS[date.getMonth()]}
      DropdownToggleButtonProps={{
        className: cn(
          classes.dropdownButton,
          classes.button,
          classes.leftRounded
        )
      }}
      renderMenu={({ close }) => (
        <div>
          {MONTHS.map((name, index) => (
            <MenuItem
              key={index}
              value={index}
              onClick={() => {
                close()
                onChange(index)
              }}
            >
              {name}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )

  // return (
  //   <Select value={date.getMonth()} onChange={handleChange}>
  //     {MONTHS.map((name, index) => (
  //       <MenuItem key={index} value={index}>
  //         {name}
  //       </MenuItem>
  //     ))}
  //   </Select>
  // )
}
