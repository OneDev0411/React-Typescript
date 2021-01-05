import React, { memo, useMemo } from 'react'
import {
  Avatar as MUIAvatar,
  AvatarProps,
  withStyles,
  Theme
} from '@material-ui/core'
import LazyLoad from 'react-lazy-load'

import { Badge } from './components/Badge'
import { BaseProps, Props } from './type'
import { getSize } from './helpers/get-size'
import { getAccountAvatar, getEmailAvatar } from './helpers/get-avatar'

const BaseAvatar = withStyles((theme: Theme) => ({
  root: (props: Props) => {
    return {
      ...getSize(theme, props.size),
      backgroundColor: theme.palette.divider,
      color: theme.palette.text.primary,
      '& svg': {
        fill: theme.palette.grey['500'],
        color: theme.palette.grey['500']
      }
    }
  }
}))((props: AvatarProps & Pick<BaseProps, 'size'>) => <MUIAvatar {...props} />)

const AvatarComponent = (props: Props) => {
  const {
    user,
    contact,
    email,
    url,
    placeHolderImage,
    statusColor,
    showStatus = false,
    disableLazyLoad = false,
    isOnline = false
  } = props
  const rawImageSrc = useMemo(() => {
    if (contact) {
      return getAccountAvatar(contact)
    }

    if (user) {
      return getAccountAvatar(user)
    }

    if (email) {
      return getEmailAvatar(email)
    }

    if (url) {
      return url
    }
  }, [contact, email, url, user])

  const imageSrc =
    !rawImageSrc && placeHolderImage ? placeHolderImage : rawImageSrc

  const baseAvatar = <BaseAvatar {...props} src={imageSrc} />
  const avatar = !disableLazyLoad ? (
    <LazyLoad>{baseAvatar}</LazyLoad>
  ) : (
    baseAvatar
  )

  if (showStatus) {
    return (
      <Badge
        overlap="circle"
        isOnline={isOnline}
        statusColor={statusColor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        variant="dot"
      >
        {avatar}
      </Badge>
    )
  }

  return avatar
}

export const Avatar = memo(AvatarComponent)
