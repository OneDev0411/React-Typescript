import React from 'react'

import { Typography, Box } from '@material-ui/core'

import { Avatar } from 'components/Avatar'
import Deal from 'models/Deal'
import { getAddress } from 'models/Deal/helpers/context'
import { goTo } from 'utils/go-to'
import { normalizeDeal } from 'views/utils/association-normalizers'

import { Container } from './styled'

interface Props {
  deal: IDeal
  contact: IContact
}

export function DealItem({ deal, contact }: Props) {
  const role = getContactRole()
  const address = getAddress(deal)
  const status = Deal.get.status(deal)
  const avatar = normalizeDeal(deal, false).avatar

  function handleOnClickItem() {
    goTo(`/dashboard/deals/${deal.id}`)
  }

  function getContactRole() {
    // TODO: fix the below typecast
    const role = (deal.roles as unknown as IDealRole[]).find(
      role => contact.emails && contact.emails.includes(role.email)
    )

    return role ? role.role : ''
  }

  return (
    <Container onClick={handleOnClickItem}>
      <Avatar {...avatar} />
      <Box ml={1} width="calc(100% - 3rem)">
        {address && <Typography variant="body2">{address}</Typography>}
        <Typography variant="caption" color="textSecondary">
          {[status, role].join(' | ')}
        </Typography>
      </Box>
    </Container>
  )
}
