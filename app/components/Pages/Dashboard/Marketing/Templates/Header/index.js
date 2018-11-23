import React from 'react'

import { Trigger as MenuTrigger } from 'components/SlideMenu'

import { headers } from './data'
import { Container, Title } from './styled'

export function Header(props) {
  const data = headers[props.medium]

  return (
    <Container
      brandColor={data.brandColor}
      name={props.medium}
      size={data.size}
      position={data.position}
    >
      <MenuTrigger
        onClick={props.toggleSideMenu}
        isExpended={props.isSideMenuOpen}
      />
      <Title>{data.title}</Title>
      <div style={{ fontSize: '1.5rem' }}>{data.description}</div>
    </Container>
  )
}
