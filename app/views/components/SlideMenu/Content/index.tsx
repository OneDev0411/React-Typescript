import React from 'react'

import { Container } from './styled'

interface Props {
  isSideMenuOpen: boolean
<<<<<<< HEAD
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
=======
  menuWidth?: string
  children: React.ReactNode
}

export const Content = ({
  children,
  isSideMenuOpen,
  menuWidth = '11rem',
  ...rest
}: Props) => (
  <Container isSideMenuOpen={isSideMenuOpen} menuWidth={menuWidth} {...rest}>
    {children}
  </Container>
)
>>>>>>> #3374 feat(website): finalize ui of websites manager
