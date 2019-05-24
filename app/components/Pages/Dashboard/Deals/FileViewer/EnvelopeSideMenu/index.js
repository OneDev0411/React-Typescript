import React from 'react'

import Envelope from '../../components/Envelope'

import { EnvelopeContainer, SideMenu } from '../styled'

export function EnvelopeSideMenu(props) {
  return (
    <SideMenu width="35rem" isOpen style={{ marginRight: 0 }}>
      <EnvelopeContainer>
        <Envelope deal={props.deal} envelope={props.envelope} />
      </EnvelopeContainer>
    </SideMenu>
  )
}
