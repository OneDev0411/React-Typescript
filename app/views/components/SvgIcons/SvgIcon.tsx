import React from 'react'
import cn from 'classnames'
import { Icon as BaseIcon } from '@mdi/react'
import { IconProps } from '@mdi/react/dist/IconProps'

import { useIconStyles } from '../../../styles/use-icon-styles'

import { muiIconSizes } from './icon-sizes'

interface Props {
    rightMargined?: boolean
    leftMargined?: boolean
}

export function SvgIcon(props: IconProps & Props) {
    const classes = useIconStyles()
    const className = cn({
        [classes.rightMargin]: props.rightMargined,
        [classes.leftMargin]: props.leftMargined
    }, props.className)
    return (
        <BaseIcon size={muiIconSizes.medium} {...props} className={className} />
    )
}