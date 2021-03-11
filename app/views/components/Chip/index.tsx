import React from 'react'
import classNames from 'classnames'
import type { ChipProps as MChipProps } from '@material-ui/core'

import useStyles from './styles'

type ChipColor = 'green' | 'orange' | 'red' | 'black'
type ChipVariant = 'text' | 'contained'

export interface ChipProps extends Pick<MChipProps, 'label'> {
  color?: ChipColor
  variant?: ChipVariant
}

function Chip({ label, color = 'black', variant = 'text' }: ChipProps) {
  const classes = useStyles()

  const colorClassNames: Record<ChipColor, string> = {
    green: classes.green,
    orange: classes.orange,
    red: classes.red,
    black: classes.black
  }

  return (
    <span
      className={classNames(
        classes.root,
        colorClassNames[color],
        variant === 'text' ? classes.text : classes.contained
      )}
    >
      {label}
    </span>
  )
}

export default Chip
