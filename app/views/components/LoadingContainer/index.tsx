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
  noPaddings?: boolean
}

export default function LoadingContainer({
  color = primary,
  size = '6em',
  title = '',
  style = {},
  className = '',
  noPaddings = false
}: Props) {
  const paddingStyle: CSSProperties = noPaddings
    ? {}
    : { padding: 'calc(50% - 1px) 0' }

  return (
    <Flex
      center
      column
      style={{
        ...paddingStyle,
        ...style
      }}
      className={className}
    >
      {/*
       // @ts-ignore */}
      <Spinner style={{ width: size, height: size }} fillColor={color} />
      {title}
    </Flex>
  )
}
