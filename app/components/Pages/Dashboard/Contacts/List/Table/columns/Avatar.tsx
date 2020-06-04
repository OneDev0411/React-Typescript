import React from 'react'
import { connect } from 'react-redux'

import {
  Avatar,
  Badge as BaseBadge,
  BadgeProps,
  makeStyles,
  createStyles,
  withStyles,
  Theme
} from '@material-ui/core'

import {
  getAttributeFromSummary,
  getContactNameInitials
} from 'models/contacts/helpers'

import { IAppState } from 'reducers'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import {
  getContactAttribute,
  getContactOnlineStatus
} from 'models/contacts/helpers'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

interface CBadgeProps extends BadgeProps {
  isOnline: boolean
}
interface StateProps {
  attributeDefs: IAttributeDefsState
}

interface Props {
  contact: INormalizedContact
}

const PATTERN = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.divider,
      color: theme.palette.text.primary
    }
  })
)

function ContactAvatar({ contact, attributeDefs }: Props & StateProps) {
  const classes = useStyles()
  const name = getAttributeFromSummary(contact, 'display_name')

  return (
    <Badge
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      variant="dot"
      isOnline={getContactOnlineStatus(contact)}
    >
      <Avatar
        alt={name}
        src={getAvatarUrl(contact, attributeDefs)}
        className={classes.avatar}
      >
        {getContactNameInitials(contact)}
      </Avatar>
    </Badge>
  )
}

function mapStateToProps({ contacts }: IAppState) {
  return { attributeDefs: contacts.attributeDefs }
}

function getAvatarUrl(contact, attributeDefs) {
  let avatar = ''

  const attribute_def = selectDefinitionByName(
    attributeDefs,
    'profile_image_url'
  )

  if (attribute_def) {
    const avatars = getContactAttribute(contact, attribute_def)

    avatar = avatars && avatars[0] && avatars[0].text

    if (!PATTERN.test(avatar)) {
      avatar = ''
    }
  }

  return avatar
}

export default connect(mapStateToProps)(ContactAvatar)
