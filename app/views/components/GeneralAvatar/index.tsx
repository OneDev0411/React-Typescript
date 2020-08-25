import React, { memo, useMemo } from 'react'
import { Avatar as MUIAvatar, makeStyles, Theme } from '@material-ui/core'

import { Props } from './type'
import { getSize } from './helpers/getSize'
import { getAccountAvatar, getDealAvatar } from './helpers/getAvatar'

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatar: (props: Props) => {
      return {
        ...getSize(theme, props.size),
        backgroundColor: theme.palette.divider,
        color: theme.palette.text.primary
      }
    }
  }),
  { name: 'Avatar' }
)

const AvatarComponent = (props: Props) => {
  const classes = useStyles(props)
  const { user, contact, deal, url } = props
  const imageSrc = useMemo(() => {
    if (contact) {
      return getAccountAvatar(contact)
    }

    if (user) {
      return getAccountAvatar(user)
    }

    if (deal) {
      return getDealAvatar(deal)
    }

    if (url) {
      return url
    }
  }, [contact, deal, url, user])

  return <MUIAvatar {...props} src={imageSrc} className={classes.avatar} />
}

export const Avatar = memo(AvatarComponent)
