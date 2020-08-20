import React, { memo, useMemo } from 'react'
import { Avatar as MUIAvatar, makeStyles, Theme } from '@material-ui/core'

import { Props } from './type'
import { getSize } from './helpers/getSize'
import { getPersonAvatar } from './helpers/getPersonAvatar'

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
  const { user, contact, url } = props
  const imageSrc = useMemo(() => {
    if (contact) {
      return getPersonAvatar(contact)
    }

    if (user) {
      return getPersonAvatar(user)
    }

    if (url) {
      return url
    }
  }, [contact, url, user])

  return <MUIAvatar {...props} src={imageSrc} className={classes.avatar} />
}

export const Avatar = memo(AvatarComponent)
