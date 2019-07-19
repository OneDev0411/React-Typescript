import React, { CSSProperties } from 'react'
import Flex from 'styled-flex-component'

import { primary } from 'views/utils/colors'
import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

LoadingContainer.defaultProps = {
  className: '',
  color: primary,
  size: '6em',
  title: '',
  style: { padding: '50% 0' }
}

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
  style = { padding: '50% 0' },
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
