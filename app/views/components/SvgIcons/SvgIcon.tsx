import React, { ComponentProps } from 'react'
import cn from 'classnames'
import { Icon as BaseIcon } from '@mdi/react'

import { useIconStyles } from '../../../styles/use-icon-styles'

import { muiIconSizes } from './icon-sizes'

type IconProps = ComponentProps<typeof BaseIcon>

interface Props {
  rightMargined?: boolean
  leftMargined?: boolean
}

export function SvgIcon(props: IconProps & Props) {
  const classes = useIconStyles()
  const className = cn(
    {
      [classes.rightMargin]: props.rightMargined,
      [classes.leftMargin]: props.leftMargined
    },
    props.className
  )

  return (
    <BaseIcon size={muiIconSizes.medium} {...props} className={className} />
  )
}
