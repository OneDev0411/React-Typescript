import React from 'react'
import fecha from 'fecha'

import LinkButton from 'components/Button/LinkButton'

import OverlayDrawer from 'components/OverlayDrawer'

import { Container, NameContainer, Title, DateTime } from './styled'

export function SelectItemDrawer(props) {
  return (
    <OverlayDrawer
      isOpen={props.isOpen}
      onClose={props.onClose}
      showFooter={false}
    >
      <OverlayDrawer.Header title={props.title} />
      <OverlayDrawer.Body>
        {props.items.map(item => (
          <Container key={item.id} onClick={() => props.onSelect(item)}>
            <NameContainer>
              <Title>{item.name}</Title>
              <DateTime>
                Uploaded at&nbsp;
                {fecha.format(new Date(), 'MMM DD YYYY, h:mm A')}
              </DateTime>
            </NameContainer>

            <LinkButton>{props.actionTitle}</LinkButton>
          </Container>
        ))}
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}
