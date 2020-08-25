import React from 'react'
import {
  Badge,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Theme
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import { GOOGLE_CREDENTIAL } from 'constants/oauth-accounts'

import GoogleIcon from 'components/SvgIcons/Google/IconGoogle'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { outlookIcon } from 'components/SvgIcons/icons'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { Avatar } from 'components/GeneralAvatar'

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
  const theme = useTheme<Theme>()
  const classes = useStyles()

  const renderAvatar = () => {
    if (item.type === 'user') {
      return <Avatar user={item} />
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
            {item.type === GOOGLE_CREDENTIAL ? (
              <GoogleIcon />
            ) : (
              <SvgIcon
                path={outlookIcon}
                color={theme.palette.info.main}
                size={muiIconSizes.small}
              />
            )}
          </div>
        }
      >
        <Avatar alt={item.display_name} user={item} />
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
