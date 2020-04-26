import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  Menu,
  Theme,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import { makeStyles, useTheme } from '@material-ui/styles'
import { addNotification } from 'reapop'

import { getEmailThread } from 'models/email/get-email-thread'
import { setEmailThreadsReadStatus } from 'models/email/set-email-threads-read-status'

import { normalizeThreadMessageToThreadEmail } from 'components/EmailThread/helpers/normalize-to-email-thread-email'
import { EmailThreadEmails } from 'components/EmailThread'
import IconVerticalDocs from 'components/SvgIcons/VeriticalDots/VerticalDotsIcon'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
// import IconReply from 'components/SvgIcons/Reply/IconReply'
// import IconReplyAll from 'components/SvgIcons/ReplyAll/IconReplyAll'
// import IconForward from 'components/SvgIcons/Forward/IconForward'
import IconTrash from 'views/components/SvgIcons/Trash/TrashIcon'
import IconMailRead from 'views/components/SvgIcons/MailRead/IconMailRead'
import IconMailUnread from 'views/components/SvgIcons/MailUnread/IconMailUnread'

import { useMenu } from 'hooks/use-menu'

import { getNameInitials } from 'utils/helpers'

import useEmailThreadEvents from '../../helpers/use-email-thread-events'
import useEmailThreadReadStatusSetter from '../../helpers/use-email-thread-read-status-setter'
import useEmailThreadDeleter from '../../helpers/use-email-thread-deleter'
import NoContentMessage from '../NoContentMessage'

const useStyles = makeStyles((theme: Theme) => ({
  moreMenu: {
    minWidth: '15rem'
  }
}))

interface Props {
  emailThreadId?: UUID
  onClose: () => void
}

export default function InboxEmailThread({ emailThreadId, onClose }: Props) {
  const [status, setStatus] = useState<
    'empty' | 'fetching' | 'error' | 'fetched'
  >('empty')
  const [emailThread, setEmailThread] = useState<IEmailThread<
    'messages' | 'contacts'
  > | null>(null)
  const { menuProps, buttonTriggerProps, onClose: closeMenu } = useMenu()
  const dispatch = useDispatch()
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const fetchEmailThread = useCallback(async () => {
    if (emailThreadId) {
      setStatus('fetching')

      try {
        const emailThread = await getEmailThread(emailThreadId)

        setEmailThread(emailThread)
        setStatus('fetched')

        if (!emailThread.is_read) {
          try {
            await setEmailThreadsReadStatus([emailThread.id], true)
          } catch (reason) {
            console.error(reason)
            dispatch(
              addNotification({
                status: 'error',
                message:
                  'Something went wrong while marking the email as read.' +
                  ' Please reload the page.'
              })
            )
          }
        }
      } catch (reason) {
        console.error(reason)
        dispatch(
          addNotification({
            status: 'error',
            message:
              'Something went wrong while fetching the email.' +
              ' Please reload the page.'
          })
        )
        setStatus('error')
      }
    } else {
      setStatus('empty')
    }
  }, [dispatch, emailThreadId])

  useEffect(() => {
    fetchEmailThread()
  }, [fetchEmailThread])

  const {
    setEmailThreadReadStatus,
    setEmailThreadReadStatusDisabled
  } = useEmailThreadReadStatusSetter(
    emailThreadId!,
    (emailThread && emailThread.is_read)!
  )
  const {
    deleteEmailThread,
    deleteEmailThreadDisabled
  } = useEmailThreadDeleter(emailThreadId!)

  const handleUpdateEmailThreads = useCallback(
    (updatedEmailThreadIds: UUID[]) => {
      if (emailThreadId && updatedEmailThreadIds.includes(emailThreadId)) {
        fetchEmailThread()
      }
    },
    [emailThreadId, fetchEmailThread]
  )
  const handleDeleteEmailThreads = useCallback(
    (deletedEmailThreadIds: UUID[]) => {
      if (emailThreadId && deletedEmailThreadIds.includes(emailThreadId)) {
        onClose()
      }

      if (emailThread && deletedEmailThreadIds.includes(emailThread.id)) {
        setEmailThread(null)
        setStatus('empty')
      }
    },
    [emailThread, emailThreadId, onClose]
  )

  useEmailThreadEvents(handleUpdateEmailThreads, handleDeleteEmailThreads)

  const recipients = useMemo(
    () =>
      emailThread
        ? emailThread.recipients_raw.map(r => {
            const contact = (emailThread.contacts || []).find(
              c =>
                c.email === r.address ||
                (c.emails && c.emails.includes(r.address))
            )
            const name =
              (contact &&
                (contact.display_name ||
                  `${contact.first_name} ${contact.middle_name} ${
                    contact.last_name
                  }`)) ||
              r.name ||
              ''

            return {
              address: r.address,
              name,
              initials: (getNameInitials(name) as string) || '',
              profileImageUrl: (contact && contact.profile_image_url) || ''
            }
          })
        : [],
    [emailThread]
  )

  const emails = useMemo(
    () =>
      emailThread
        ? emailThread.messages.map(normalizeThreadMessageToThreadEmail)
        : [],
    [emailThread]
  )

  if (
    (status === 'fetching' &&
      (!emailThread || emailThread.id !== emailThreadId)) ||
    (status === 'empty' && emailThreadId)
  ) {
    return null
  }

  if (status === 'error') {
    return <NoContentMessage error>Error Opening Conversation</NoContentMessage>
  }

  if (status === 'empty' || !emailThread) {
    return <NoContentMessage>No Conversations Selected</NoContentMessage>
  }

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        paddingY={3.5}
        paddingLeft={2}
        paddingRight={2.5}
      >
        <Box width={0} flexGrow={1} paddingLeft={7.5}>
          <Typography variant="h5" noWrap>
            {emailThread.subject || '(No Subject)'}
          </Typography>
        </Box>
        {!!emailThread.contacts && emailThread.contacts.length > 0 && (
          <Box marginX={3} display="flex">
            <AvatarGroup>
              {(recipients.length <= 3
                ? recipients
                : recipients.slice(0, 2)
              ).map((c, index) => (
                <Avatar key={index} alt={c.initials} src={c.profileImageUrl}>
                  {c.initials}
                </Avatar>
              ))}
              {recipients.length > 3 && (
                <Avatar>+{recipients.length - 2}</Avatar>
              )}
            </AvatarGroup>
          </Box>
        )}
        <Tooltip title="More">
          <IconButton {...buttonTriggerProps}>
            <IconVerticalDocs size="small" />
          </IconButton>
        </Tooltip>
        <Menu
          {...menuProps}
          disableScrollLock
          classes={{ paper: classes.moreMenu }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem
            dense
            onClick={() => {
              setEmailThread(null)
              setStatus('empty')
              onClose()
              closeMenu()
            }}
          >
            <ListItemIcon>
              <IconClose size="small" />
            </ListItemIcon>
            <ListItemText>Close Conversation</ListItemText>
          </MenuItem>
          {/* <MenuItem dense onClick={select(props.onReply)}>
            <ListItemIcon>
              <IconReply size='small' />
            </ListItemIcon>
            <ListItemText>Reply</ListItemText>
          </MenuItem>
          {hasReplyAll(props.email) && (
            <MenuItem dense onClick={select(props.onReplyAll)}>
              <ListItemIcon>
                <IconReplyAll size='small' />
              </ListItemIcon>
              <ListItemText>Reply All</ListItemText>
            </MenuItem>
          )}
          <MenuItem dense onClick={select(props.onForward)}>
            <ListItemIcon>
              <IconForward size='small' />
            </ListItemIcon>
            <ListItemText>Forward</ListItemText>
          </MenuItem> */}
          <MenuItem
            disabled={setEmailThreadReadStatusDisabled}
            dense
            onClick={() => {
              setEmailThreadReadStatus(!emailThread.is_read)
              closeMenu()
            }}
          >
            <ListItemIcon>
              {emailThread.is_read ? (
                <IconMailUnread size="small" />
              ) : (
                <IconMailRead size="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              Mark as {emailThread.is_read ? 'unread' : 'read'}
            </ListItemText>
          </MenuItem>
          <Box marginY={1}>
            <Divider />
          </Box>
          <MenuItem
            disabled={deleteEmailThreadDisabled}
            dense
            onClick={() => {
              deleteEmailThread()
              closeMenu()
            }}
          >
            <ListItemIcon>
              <IconTrash size="small" fillColor={theme.palette.error.main} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: 'error' }}>
              Delete
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <Box overflow="auto">
        <EmailThreadEmails emails={emails} />
      </Box>
    </Box>
  )
}
