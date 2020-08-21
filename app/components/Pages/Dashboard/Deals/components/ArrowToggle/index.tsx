import React from 'react'
import { mdiChevronRight } from '@mdi/js'
import { makeStyles } from '@material-ui/core'
import cn from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(() => ({
  rotated: {
    transform: 'rotateZ(90deg)'
  }
}))

interface Props {
  style?: React.CSSProperties
  isActive: boolean
}

export function ArrowToggle({ style, isActive }: Props) {
  const classes = useStyles()

  return (
    <SvgIcon
      path={mdiChevronRight}
      style={style}
      className={cn({
        [classes.rotated]: isActive
      })}
    />
  )
}
