import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useTheme } from '@material-ui/styles'

import { nl2br } from 'utils/nl2br'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { clearDealNotifications } from 'actions/deals'

import { Callout } from 'components/Callout'

interface Props {
  deal: IDeal
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      color: theme.palette.common.white,
      margin: `${theme.spacing(1, 0)} !important`
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1)
    }
  }),
  { name: 'DealNotification' }
)

export default function Notifications({ deal }: Props) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const unreadNotifications = Array.isArray(deal.new_notifications)
    ? (deal.new_notifications.filter(
        notification => notification.room === null
      ) as (IChatMessage & {
        message: string
      })[])
    : []

  const [isOpen, setIsOpen] = useState(unreadNotifications.length > 0)

  useEffectOnce(() => {
    dispatch(clearDealNotifications())
  })

  if (!isOpen || unreadNotifications.length === 0) {
    return null
  }

  return (
    <Callout type="info" className={classes.root}>
      <div className={classes.header}>
        <Typography variant="subtitle1">
          Notifications since your last visit
        </Typography>

        <IconButton size="small" onClick={() => setIsOpen(false)}>
          <CloseIcon fillColor={theme.palette.common.white} size="small" />
        </IconButton>
      </div>

      {unreadNotifications.map(notification => (
        <Typography
          key={notification.id}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: nl2br(notification.message)
          }}
        />
      ))}
    </Callout>
  )
}
