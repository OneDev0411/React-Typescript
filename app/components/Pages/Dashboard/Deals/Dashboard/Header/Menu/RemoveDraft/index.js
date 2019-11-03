import React from 'react'

import { Tooltip } from '@material-ui/core'

import LinkButton from 'components/Button/LinkButton'

import { Container } from './styled'

export function RemoveDraft(props) {
  return (
    <Container>
      <Tooltip title="You can only see this deal">
        <LinkButton
          appearance="primary"
          to={`/dashboard/deals/create/${props.deal.id}`}
        >
          Make visible to admin
        </LinkButton>
      </Tooltip>
    </Container>
  )
}
