import React, { useMemo } from 'react'
import { Paper, Grid, Typography, Box } from '@material-ui/core'
import fecha from 'fecha'
import classNames from 'classnames'

import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { useInboxEmailThreadListItemStyles } from './styles'
import getRecipientNamesText from './helpers/get-recipient-names-text'

interface Props {
  emailThread: IEmailThread<'contacts'>
  selected?: boolean
}

export default function InboxEmailThreadListItem({
  emailThread,
  selected
}: Props) {
  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const recipients = useMemo(() => getRecipientNamesText(user, emailThread), [
    user,
    emailThread
  ])

  const messageDate = new Date(emailThread.last_message_date * 1000)
  const messageDateText = fecha.format(messageDate, 'MMMM D, YYYY - h:mm A')
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const messageDateShortText = fecha.format(
    messageDate,
    messageDate < today ? 'D\u00A0MMM' : 'h:mm\u00A0A'
  )

  const classes = useInboxEmailThreadListItemStyles()

  return (
    <Paper
      elevation={0}
      square
      classes={{
        root: classNames(classes.root, selected && classes.selected)
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <div
            className={classNames(
              classes.status,
              !emailThread.is_read && classes.unread
            )}
          />
        </Grid>
        <Grid item xs container spacing={0} classes={{ root: classes.info }}>
          <Grid item xs={12} classes={{ root: classes.flex }}>
            <Typography
              variant={emailThread.is_read ? 'body2' : 'subtitle2'}
              display="inline"
              noWrap
              title={recipients}
            >
              {recipients}
            </Typography>
            {emailThread.message_count > 1 && (
              <Typography
                variant={emailThread.is_read ? 'body2' : 'subtitle2'}
                display="inline"
              >
                &nbsp;({emailThread.message_count})
              </Typography>
            )}
            <div className={classes.grow} />
            <Typography
              variant="caption"
              display="inline"
              title={messageDateText}
            >
              &nbsp;&nbsp;{messageDateShortText}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box paddingTop="4px">
              <Typography
                variant="subtitle2"
                noWrap
                title={emailThread.subject || undefined}
              >
                {emailThread.subject || '(No Subject)'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              classes={{
                root: classes.message
              }}
            >
              {emailThread.snippet}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
