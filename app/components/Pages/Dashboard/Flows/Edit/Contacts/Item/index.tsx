import React from 'react'
import {
  Grid,
  Tooltip,
  Avatar,
  Typography,
  Button,
  TableCell,
  TableRow
} from '@material-ui/core'

import { getUserInitials } from 'models/user/helpers/get-user-initials'

import ALink from 'components/ALink'

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
          <Avatar
            src={contact.summary && contact.summary.profile_image_url}
            style={{ marginRight: '1rem' }}
          >
            {getUserInitials(contact.summary)}
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
        <Tooltip title="Stop flow for this contact">
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={event => {
              event.stopPropagation()
              onStop(contact)
            }}
          >
            Stop
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
