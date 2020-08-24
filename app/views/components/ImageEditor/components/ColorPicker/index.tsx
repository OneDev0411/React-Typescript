import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import { CirclePicker, ColorResult } from 'react-color'

import { BaseDropdown } from 'components/BaseDropdown'

const useStyles = makeStyles((theme: Theme) => ({
  picker: {
    padding: theme.spacing(1)
  },
  color: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '100%',
    borderColor: '1px solid #262626',
    '&:hover': {
      opacity: 0.8,
      cursor: 'pointer'
    }
  }
}))

interface Props {
  color?: string
  onChange: (color: ColorResult) => void
}

export function ColorPicker({ color = '#000', onChange }: Props) {
  const classes = useStyles()

  return (
    <BaseDropdown
      PopperProps={{
        placement: 'top'
      }}
      renderDropdownButton={props => (
        <span
          {...props}
          className={classes.color}
          style={{
            backgroundColor: color
          }}
        />
      )}
      renderMenu={({ close }) => (
        <div className={classes.picker}>
          <CirclePicker
            color={color}
            onChange={(result: ColorResult) => {
              close()
              onChange(result)
            }}
          />
        </div>
      )}
    />
  )
}
