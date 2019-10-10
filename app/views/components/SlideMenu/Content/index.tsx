import React from 'react'

import { Container } from './styled'

interface Props {
  isSideMenuOpen: boolean
  menuWidth?: React.CSSProperties['width']
  children: React.ReactNode
}

export function Content({
  isSideMenuOpen,
  menuWidth = '11rem',
  children,
  ...rest
}: Props) {
  return (
    <Container isSideMenuOpen={isSideMenuOpen} menuWidth={menuWidth} {...rest}>
      {children}
    </Container>
  )
}
