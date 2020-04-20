import React from 'react'
import { MenuItem } from '@material-ui/core'
import cn from 'classnames'

import { months } from 'utils/date-times/months'

import { BaseDropdown } from 'components/BaseDropdown'

import { useStyles } from '../use-styles'

interface Props {
  date: Date
  onChange: (value: number) => void
}

export function Month({ date, onChange }: Props) {
  const classes = useStyles()
  const selectedMonth = months[date.getMonth()]

  return (
    <BaseDropdown
      buttonLabel={selectedMonth}
      DropdownToggleButtonProps={{
        className: cn(
          classes.dropdownButton,
          classes.button,
          classes.leftRounded
        )
      }}
      renderMenu={({ close }) => (
        <div>
          {months.map((name, index) => (
            <MenuItem
              key={index}
              value={index}
              onClick={() => {
                close()
                onChange(index)
              }}
            >
              {selectedMonth === name ? (
                <strong>{name}</strong>
              ) : (
                <span>{name}</span>
              )}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
