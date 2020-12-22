import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Paper, Typography, IconButton, Tooltip } from '@material-ui/core'
import fecha from 'fecha'
import classNames from 'classnames'
import {
  mdiEmailOutline,
  mdiEmailOpenOutline,
  mdiTrashCanOutline,
  mdiArchiveOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { selectUser } from 'selectors/user'

import { useInboxEmailThreadListItemStyles } from './styles'
import getRecipientNamesText from './helpers/get-recipient-names-text'
import useEmailThreadReadStatusSetter from '../../../../helpers/use-email-thread-read-status-setter'
import useEmailThreadDeleter from '../../../../helpers/use-email-thread-deleter'
import useEmailThreadArchiver from '../../../../helpers/use-email-thread-archiver'

interface Props {
  emailThread: IEmailThread<'contacts'>
  selected?: boolean
}

export default function InboxEmailThreadListItem({
  emailThread,
  selected
}: Props) {
  const user = useSelector(selectUser)

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

  const {
    setEmailThreadReadStatus,
    setEmailThreadReadStatusDisabled
  } = useEmailThreadReadStatusSetter(emailThread.id, emailThread.is_read)
  const {
    deleteEmailThread,
    deleteEmailThreadDisabled
  } = useEmailThreadDeleter(emailThread.id)
  const {
    archiveEmailThread,
    archiveEmailThreadDisabled
  } = useEmailThreadArchiver(emailThread.id)

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
          <div className={classes.actions}>
            <Tooltip
              title={
                setEmailThreadReadStatusDisabled
                  ? `Marking as ${emailThread.is_read ? 'unread' : 'read'}...`
                  : `Mark as ${emailThread.is_read ? 'unread' : 'read'}`
              }
            >
              <IconButton
                className={classNames(
                  classes.action,
                  setEmailThreadReadStatusDisabled && classes.actionDisabled
                )}
                onClick={event => {
                  setEmailThreadReadStatus(!emailThread.is_read)
                  event.stopPropagation()
                }}
              >
                {emailThread.is_read ? (
                  <SvgIcon path={mdiEmailOutline} size={muiIconSizes.small} />
                ) : (
                  <SvgIcon
                    path={mdiEmailOpenOutline}
                    size={muiIconSizes.small}
                  />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip
              title={deleteEmailThreadDisabled ? 'Deleting...' : 'Delete'}
            >
              <IconButton
                className={classNames(
                  classes.action,
                  deleteEmailThreadDisabled && classes.actionDisabled
                )}
                onClick={event => {
                  deleteEmailThread()
                  event.stopPropagation()
                }}
              >
                <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={archiveEmailThreadDisabled ? 'Archiving...' : 'Archive'}
            >
              <IconButton
                className={classNames(
                  classes.action,
                  archiveEmailThreadDisabled && classes.actionDisabled
                )}
                onClick={event => {
                  archiveEmailThread()
                  event.stopPropagation()
                }}
              >
                <SvgIcon path={mdiArchiveOutline} size={muiIconSizes.small} />
              </IconButton>
            </Tooltip>
          </div>
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
