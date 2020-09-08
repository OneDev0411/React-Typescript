import React from 'react'
import { Typography, Box } from '@material-ui/core'

import Deal from 'models/Deal'
import { goTo } from 'utils/go-to'
import { Avatar } from 'components/GeneralAvatar'
import { getAddress } from 'models/Deal/helpers/context'
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
    const role = deal.roles.find(
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
