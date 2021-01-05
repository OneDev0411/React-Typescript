import React, { ComponentProps } from 'react'
import cn from 'classnames'
import { Icon as BaseIcon } from '@mdi/react'

import { useIconStyles } from '../../../styles/use-icon-styles'

import { muiIconSizes } from './icon-sizes'


export interface Props extends ComponentProps<typeof BaseIcon> {
  rightMargined?: boolean
  leftMargined?: boolean
}

export function SvgIcon({
  rightMargined,
  leftMargined,
  ...props
}: Props) {
  const classes = useIconStyles()
  const className = cn({
    [classes.rightMargin]: rightMargined,
    [classes.leftMargin]: leftMargined
  }, props.className)

  return (
    <BaseIcon size={muiIconSizes.medium} {...props} className={className} />
  )
}
