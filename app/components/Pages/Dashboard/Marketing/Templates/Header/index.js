import React from 'react'

import { Trigger as MenuTrigger } from 'components/SlideMenu'

import { Container, Title, SubTitle } from './styled'

export function Header({ data, ...props }) {
  return (
    <Container
      brandColor={data.brandColor}
      name={data.name || props.types}
      size={data.size}
      position={data.position}
      isSideMenuOpen={props.isSideMenuOpen}
      data-test="mc-store-page-header"
    >
      <MenuTrigger
        onClick={props.toggleSideMenu}
        isExpended={props.isSideMenuOpen}
      />
      <Title>{data.title}</Title>
      <SubTitle isSideMenuOpen={props.isSideMenuOpen}>
        {data.description}
      </SubTitle>
    </Container>
  )
}
