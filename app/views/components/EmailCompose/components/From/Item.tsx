import React from 'react'
import {
  Avatar,
  Badge,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Theme
} from '@material-ui/core'

import { GOOGLE_CREDENTIAL } from 'constants/oauth-accounts'

import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import OutlookIcon from 'components/SvgIcons/Outlook/IconOutlook'

const useStyles = makeStyles(
  (theme: Theme) => ({
    badge: {
      width: theme.spacing(2),
      height: theme.spacing(2),
      borderRadius: '100%',
      backgroundColor: theme.palette.common.white,
      border: `2px solid ${theme.palette.background.paper}`,

      '& > svg': {
        width: theme.spacing(1.5),
        height: theme.spacing(1.5)
      }
    }
  }),
  { name: 'Item' }
)

interface Props {
  item: IUser | IOAuthAccount
}

export function Item({ item }: Props) {
  const classes = useStyles()

  const renderAvatar = () => {
    const src = item.profile_image_url || ''

    if (item.type === 'user') {
      return <Avatar src={src} />
    }

    return (
      <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        badgeContent={
          <div className={classes.badge}>
            {item.type === GOOGLE_CREDENTIAL ? <GoogleIcon /> : <OutlookIcon />}
          </div>
        }
      >
        <Avatar alt={item.display_name} src={src} />
      </Badge>
    )
  }

  return (
    <>
      <ListItemAvatar>{renderAvatar()}</ListItemAvatar>
      <ListItemText primary={item.display_name} secondary={item.email} />
    </>
  )
}
