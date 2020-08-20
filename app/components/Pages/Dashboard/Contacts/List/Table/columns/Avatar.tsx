import React from 'react'
import { connect } from 'react-redux'

import {
  Badge as BaseBadge,
  BadgeProps,
  createStyles,
  withStyles,
  Theme
} from '@material-ui/core'

import { Avatar } from 'components/GeneralAvatar'

import {
  getAttributeFromSummary,
  getContactNameInitials
} from 'models/contacts/helpers'

import { IAppState } from 'reducers'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import { getContactOnlineStatus } from 'models/contacts/helpers'

interface CBadgeProps extends BadgeProps {
  isOnline: boolean
}
interface StateProps {
  attributeDefs: IAttributeDefsState
}

interface Props {
  contact: INormalizedContact
}

const Badge = withStyles((theme: Theme) =>
  createStyles({
    badge: (props: CBadgeProps) => ({
      backgroundColor: props.isOnline ? theme.palette.success.light : 'inherit',
      color: props.isOnline ? theme.palette.success.light : 'inherit',
      boxShadow: props.isOnline
        ? `0 0 0 2px ${theme.palette.background.paper}`
        : '0'
    })
  })
)(BaseBadge)

function ContactAvatar({ contact, attributeDefs }: Props & StateProps) {
  const name = getAttributeFromSummary(contact, 'display_name')

  return (
    <Badge
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      variant="dot"
      isOnline={getContactOnlineStatus(contact)}
    >
      <Avatar alt={name} contact={contact}>
        {getContactNameInitials(contact)}
      </Avatar>
    </Badge>
  )
}

function mapStateToProps({ contacts }: IAppState) {
  return { attributeDefs: contacts.attributeDefs }
}

export default connect(mapStateToProps)(ContactAvatar)
