import React from 'react'

import { Box, BoxProps } from '@material-ui/core'

import { Container, ContainerProps } from './Container'
import { Header, HeaderProps } from './Header'
import { PoweredBy, Props as PoweredByProps } from './PoweredBy'

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

OAuthPageLayout.PoweredBy = (props: PoweredByProps) => <PoweredBy {...props} />
