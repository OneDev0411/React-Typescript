import React from 'react'
import {
  Grid,
  Tooltip,
  Typography,
  TableCell,
  TableRow
} from '@material-ui/core'

import { getContactNameInitials } from 'models/contacts/helpers'
import ALink from 'components/ALink'
import { DangerButton } from 'components/Button/DangerButton'
import { Avatar } from 'components/Avatar'

interface Props {
  contact: IContact
  onStop: (contact: IContact) => Promise<any>
  onClick: (contactId: UUID) => void
}

export default function Item({ contact, onStop, onClick }: Props) {
  return (
    <TableRow>
      <TableCell>
        <Grid container alignItems="center">
          <Avatar contact={contact} style={{ marginRight: '1rem' }}>
            {getContactNameInitials(contact)}
          </Avatar>
          <ALink
            style={{ cursor: 'pointer' }}
            onClick={() => onClick(contact.id)}
          >
            <Typography variant="subtitle1">{contact.display_name}</Typography>
          </ALink>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">
          {contact.summary && contact.summary.email}
        </Typography>
        <Typography variant="subtitle2">
          {contact.summary && contact.summary.phone_number}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Stop Flow for this contact">
          <DangerButton
            variant="outlined"
            size="small"
            onClick={event => {
              event.stopPropagation()
              onStop(contact)
            }}
          >
            Stop
          </DangerButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
