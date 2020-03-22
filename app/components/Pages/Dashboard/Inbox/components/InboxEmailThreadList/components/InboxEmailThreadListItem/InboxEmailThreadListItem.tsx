import React, { useMemo } from 'react'
import { Paper, Typography } from '@material-ui/core'
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
        root: classes.root
      }}
    >
      <div
        className={classNames(
          classes.status,
          !emailThread.is_read && classes.statusUnread
        )}
      />
      <div
        className={classNames(
          classes.info,
          emailThread.is_read && classes.infoRead,
          selected && classes.infoSelected
        )}
      >
        <div className={classes.flex}>
          <Typography
            variant={emailThread.is_read ? 'body2' : 'subtitle2'}
            display="inline"
            noWrap
            title={recipients}
            classes={{ root: classes.recipients }}
          >
            {recipients || <>&nbsp;</>}
          </Typography>
          {emailThread.message_count > 1 && (
            <Typography
              variant={emailThread.is_read ? 'body2' : 'subtitle2'}
              display="inline"
              classes={{ root: classes.recipients }}
            >
              &nbsp;({emailThread.message_count})
            </Typography>
          )}
          <div className={classes.grow} />
          <Typography
            variant="caption"
            display="inline"
            title={messageDateText}
            classes={{
              root: classNames(
                classes.date,
                !emailThread.is_read && classes.dateUnread
              )
            }}
          >
            &nbsp;&nbsp;{messageDateShortText}
          </Typography>
        </div>
        <Typography
          variant={emailThread.is_read ? 'body2' : 'subtitle2'}
          noWrap
          title={emailThread.subject || undefined}
          classes={{ root: classes.subject }}
        >
          {emailThread.subject || '(No Subject)'}
        </Typography>
        <Typography
          variant="body2"
          classes={{
            root: classNames(
              classes.snippet,
              emailThread.is_read && classes.snippetRead
            )
          }}
          noWrap
        >
          {emailThread.snippet || <>&nbsp;</>}
        </Typography>
      </div>
    </Paper>
  )
}
