import React from 'react'
import { Icon as BaseIcon } from '@mdi/react'
import { IconProps } from '@mdi/react/dist/IconProps'

import { muiIconSizes } from './icon-sizes'

export function SvgIcon(props: IconProps) {
    return (
        <BaseIcon size={muiIconSizes.medium} {...props} />
    )
}