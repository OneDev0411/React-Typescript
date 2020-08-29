import React, { memo, useMemo } from 'react'
import {
  Avatar as MUIAvatar,
  AvatarProps,
  withStyles,
  Theme
} from '@material-ui/core'

import { BaseProps, Props } from './type'
import { getSize } from './helpers/getSize'
import { getAccountAvatar, getEmailAvatar } from './helpers/getAvatar'

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
  const { user, contact, email, url } = props
  const imageSrc = useMemo(() => {
    if (contact) {
      return getAccountAvatar(contact)
    }

    if (user) {
      return getAccountAvatar(user)
    }

    if (email) {
      getEmailAvatar(email)
    }

    if (url) {
      return url
    }
  }, [contact, email, url, user])

  return <BaseAvatar {...props} src={imageSrc} />
}

export const Avatar = memo(AvatarComponent)
