import React, { CSSProperties } from 'react'
import Flex from 'styled-flex-component'

import { primary } from 'views/utils/colors'
import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

interface Props {
  className?: string
  color?: string
  size?: string
  title?: string
  style?: CSSProperties
}

export default function LoadingContainer({
  color = primary,
  size = '6em',
  title = '',
  style = { padding: 'calc(50% - 1px) 0' },
  className = ''
}: Props) {
  return (
    <Flex center column style={style} className={className}>
      {/*
       // @ts-ignore */}
      <Spinner style={{ width: size, height: size }} fillColor={color} />
      {title}
    </Flex>
  )
}
