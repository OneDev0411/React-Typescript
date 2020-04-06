import React from 'react'
import { Box, BoxProps } from '@material-ui/core'

import { Header, HeaderProps } from './Header'
import { Container, ContainerProps } from './Container'

interface Props extends ContainerProps {
  children: React.ReactNode
}

export const OAuthPageLayout = (props: Props) => {
  return (
    <Container classes={props.classes} className={props.className}>
      {props.children}
    </Container>
  )
}

OAuthPageLayout.Header = (props: HeaderProps) => <Header {...props} />

OAuthPageLayout.Main = (props: BoxProps) => <Box {...props} />
