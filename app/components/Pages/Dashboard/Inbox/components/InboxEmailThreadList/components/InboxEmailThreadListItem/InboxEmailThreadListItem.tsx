import React, { useMemo } from 'react'
import { Paper, Typography } from '@material-ui/core'
import fecha from 'fecha'
import classNames from 'classnames'

import useTypedSelector from 'hooks/use-typed-selector'

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
  const user = useTypedSelector<IUser>(state => state.user)

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
    <Paper elevation={0} square className={classes.root}>
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
            className={classNames(
              classes.recipients,
              emailThread.is_read && classes.recipientsRead
            )}
          >
            {recipients || <>&nbsp;</>}
          </Typography>
          {emailThread.message_count > 1 && (
            <Typography
              variant={emailThread.is_read ? 'body2' : 'subtitle2'}
              display="inline"
              className={classNames(
                classes.recipients,
                emailThread.is_read && classes.recipientsRead
              )}
            >
              &nbsp;({emailThread.message_count})
            </Typography>
          )}
          <div className={classes.grow} />
          <Typography
            variant="caption"
            display="inline"
            title={messageDateText}
            className={classNames(
              classes.date,
              !emailThread.is_read && classes.dateUnread
            )}
          >
            &nbsp;&nbsp;{messageDateShortText}
          </Typography>
        </div>
        <Typography
          variant={emailThread.is_read ? 'body2' : 'subtitle2'}
          noWrap
          title={emailThread.subject || undefined}
          className={classNames(
            classes.subject,
            emailThread.is_read && classes.subjectRead
          )}
        >
          {emailThread.subject || '(No Subject)'}
        </Typography>
        <Typography
          variant="body2"
          className={classNames(
            classes.snippet,
            emailThread.is_read && classes.snippetRead
          )}
          noWrap
        >
          {emailThread.snippet || <>&nbsp;</>}
        </Typography>
      </div>
    </Paper>
  )
}
