import React from 'react'

import LinkButton from 'components/Button/LinkButton'
import IconLock from 'components/SvgIcons/Lock/IconLock'

import { Container, Description } from './styled'

export function RemoveDraft(props) {
  return (
    <Container>
      <LinkButton
        appearance="primary"
        to={`/dashboard/deals/create/${props.deal.id}`}
      >
        Make visible to admin
      </LinkButton>

      <Description>
        <IconLock /> You can only see this deal
      </Description>
    </Container>
  )
}
