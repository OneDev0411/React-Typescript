import React from 'react'
import timeago from 'timeago.js'

import IconButton from '../../../../components/Button/IconButton'
import ArrowRightIcon from '../../../../components/SvgIcons/KeyboardArrowRight/IconKeyboardArrowRight'

import { Container } from './styled'

export function Item(props) {
  const { touch } = props

  return (
    <Container>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '.5em'
        }}
      >
        <span
          style={{
            fontSize: 'small',
            marginRight: '0.5em',
            padding: '0 0.5em',
            borderRadius: 30,
            color: '#fff',
            background: '#8da2b5'
          }}
        >
          {touch.activity_type}
        </span>
        {touch.description && (
          <span
            style={{
              lineHeight: 1,
              fontSize: '1.5rem'
            }}
          >
            {touch.description.length > 33
              ? `${touch.description.slice(0, 33)}...`
              : touch.description}
          </span>
        )}
      </div>
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
          top: '35%',
          right: '1em',
          transform: 'translateY(-35%)'
        }}
      >
        <ArrowRightIcon style={{ width: 32, height: 32 }} />
      </IconButton>
    </Container>
  )
}
