import React from 'react'
import timeago from 'timeago.js'

import IconButton from '../../../../components/Button/IconButton'
import ArrowRightIcon from '../../../../components/SvgIcons/KeyboardArrowRight/IconKeyboardArrowRight'

import { Container } from './styled'

export function Item(props) {
  const { touch } = props

  return (
    <Container>
      <h4
        style={{
          margin: '0 0 0.25em',
          fontSize: '1.8rem',
          fontWeight: 'normal',
          color: '#1e364b'
        }}
      >
        {touch.activity_type}
      </h4>
      <div style={{ color: '#8da2b5' }}>
        {timeago().format(new Date(touch.timestamp * 1000))}
      </div>
      <IconButton
        size="32px"
        color="#cecece"
        hoverColor="#2196f3"
        onClick={() => props.onClick(touch)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '1em',
          transform: 'translateY(-50%)'
        }}
      >
        <ArrowRightIcon style={{ width: 32, height: 32 }} />
      </IconButton>
    </Container>
  )
}
