import React from 'react'
import classNames from 'classnames'
import type { ChipProps as MChipProps } from '@material-ui/core'

import useStyles from './styles'

type ChipColor = 'green' | 'orange' | 'red' | 'black'

export interface ChipProps extends Pick<MChipProps, 'label'> {
  color?: ChipColor
}

function Chip({ label, color = 'black' }: ChipProps) {
  const classes = useStyles()

  const colorClassNames: Record<ChipColor, string> = {
    green: classes.green,
    orange: classes.orange,
    red: classes.red,
    black: classes.black
  }

  return (
    <span className={classNames(classes.root, colorClassNames[color])}>
      {label}
    </span>
  )
}

export default Chip
