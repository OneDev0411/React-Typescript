import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core'

import { useTheme } from '@material-ui/styles'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { mdiClose } from '@mdi/js'

import { nl2br } from 'utils/nl2br'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { clearDealNotifications } from 'actions/deals'

import { Callout } from 'components/Callout'

interface Props {
  deal: IDeal
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      color: theme.palette.common.black,
      margin: `${theme.spacing(1, 5)} !important`
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1),
      color: theme.palette.common.black
    }
  }),
  { name: 'DealNotification' }
)

export default function Notifications({ deal }: Props) {
  const newNotificationsCount = (deal.new_notifications || []).length

  const getUnreadNotifications = useCallback(() => {
    return (deal.new_notifications || []).filter(
      notification => notification.room === null
    ) as (IChatMessage & {
      message: string
    })[]
  }, [deal.new_notifications])

  const [unreadNotifications, setUnreadNotifications] = useState(
    getUnreadNotifications()
  )
  const dispatch = useDispatch()
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const clearNotifications = () => {
    dispatch(clearDealNotifications(deal))
  }

  const handleClose = () => {
    clearNotifications()
    setUnreadNotifications([])
  }

  useEffectOnce(() => {
    clearNotifications()
  })

  useEffect(() => {
    if (newNotificationsCount > 0) {
      setUnreadNotifications(getUnreadNotifications())
    }
  }, [newNotificationsCount, getUnreadNotifications])

  if (unreadNotifications.length === 0) {
    return null
  }

  return (
    <Callout type="info" className={classes.root}>
      <div className={classes.header}>
        <Typography variant="subtitle1">
          Notifications since your last visit
        </Typography>

        <IconButton size="small" onClick={handleClose}>
          <SvgIcon path={mdiClose} color={theme.palette.common.black} />
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
