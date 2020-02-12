import React from 'react'

import { MenuItem } from '@material-ui/core'
import cn from 'classnames'

import { BaseDropdown } from 'components/BaseDropdown'

import { useStyles } from '../use-styles'

interface Props {
  date: Date
  onChange: (year: number) => void
}

export function Year({ date, onChange }: Props) {
  const classes = useStyles()

  return (
    <BaseDropdown
      buttonLabel={date.getFullYear()}
      DropdownToggleButtonProps={{
        className: cn(classes.dropdownButton, classes.button)
      }}
      renderMenu={({ close }) => (
        <div>
          {getYearsRange().map((value, index) => (
            <MenuItem
              key={index}
              value={value}
              onClick={() => {
                close()
                onChange(value)
              }}
            >
              {value}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}

function getYearsRange() {
  const startYear = new Date().getFullYear() + 1

  return new Array(4).fill(null).map((_, index) => startYear - index)
}
