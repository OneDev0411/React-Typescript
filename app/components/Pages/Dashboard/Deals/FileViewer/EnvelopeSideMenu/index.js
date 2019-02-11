import React from 'react'

import Envelope from '../../components/Envelope'

import { SideMenu } from '../styled'
import { Container } from './styled'

export function EnvelopeSideMenu(props) {
  return (
    <SideMenu width="35rem" isOpen style={{ marginRight: 0 }}>
      <Container>
        <Envelope deal={props.deal} envelope={props.envelope} />
      </Container>
    </SideMenu>
  )
}
