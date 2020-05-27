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
  Divider,
  Paper
} from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import { makeStyles, useTheme } from '@material-ui/styles'
import { addNotification } from 'reapop'

import {
  mdiEmailOpenOutline,
  mdiEmailOutline,
  mdiTrashCanOutline,
  mdiDotsVertical,
  mdiForward,
  mdiReplyAll,
  mdiReply,
  mdiClose
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getEmailThread } from 'models/email/get-email-thread'
import { setEmailThreadsReadStatus } from 'models/email/set-email-threads-read-status'

import { normalizeThreadMessageToThreadEmail } from 'components/EmailThread/helpers/normalize-to-email-thread-email'
import { EmailThreadEmails } from 'components/EmailThread'
import { EmailResponseType } from 'components/EmailThread/types'
import { EmailResponseComposeForm } from 'components/EmailCompose/EmailResponseComposeForm'

import { useMenu } from 'hooks/use-menu'

import { getNameInitials } from 'utils/helpers'

import useEmailThreadEvents from '../../helpers/use-email-thread-events'
import useEmailThreadReadStatusSetter from '../../helpers/use-email-thread-read-status-setter'
import useEmailThreadDeleter from '../../helpers/use-email-thread-deleter'
import NoContentMessage from '../NoContentMessage'

const useStyles = makeStyles((theme: Theme) => ({
  moreMenu: {
    minWidth: '15rem'
  },
  icon: {
    color: theme.palette.common.black
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

  const fetchEmailThread = useCallback(
    async (skipMarkingAsRead: boolean = false) => {
      if (emailThreadId) {
        setStatus('fetching')

        try {
          const emailThread = await getEmailThread(emailThreadId)

          setEmailThread(emailThread)
          setStatus('fetched')

          if (!skipMarkingAsRead && !emailThread.is_read) {
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
    },
    [dispatch, emailThreadId]
  )

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
        fetchEmailThread(true)
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

  const hasReplyAll = emailThread && emailThread.recipients.length > 1 // TODO: Is this logic correct?

  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [responseType, setResponseType] = useState<EmailResponseType>('reply')

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
                  `${contact.first_name} ${contact.middle_name} ${contact.last_name}`)) ||
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
            <SvgIcon path={mdiDotsVertical} className={classes.icon} />
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
              <SvgIcon path={mdiClose} className={classes.icon} />
            </ListItemIcon>
            <ListItemText>Close</ListItemText>
          </MenuItem>
          <MenuItem
            dense
            onClick={() => {
              setResponseType('reply')
              setIsResponseOpen(true)
              closeMenu()
            }}
          >
            <ListItemIcon>
              <SvgIcon path={mdiReply} className={classes.icon} />
            </ListItemIcon>
            <ListItemText>Reply</ListItemText>
          </MenuItem>
          {hasReplyAll && (
            <MenuItem
              dense
              onClick={() => {
                setResponseType('replyAll')
                setIsResponseOpen(true)
                closeMenu()
              }}
            >
              <ListItemIcon>
                <SvgIcon path={mdiReplyAll} className={classes.icon} />
              </ListItemIcon>
              <ListItemText>Reply All</ListItemText>
            </MenuItem>
          )}
          <MenuItem
            dense
            onClick={() => {
              setResponseType('forward')
              setIsResponseOpen(true)
              closeMenu()
            }}
          >
            <ListItemIcon>
              <SvgIcon path={mdiForward} className={classes.icon} />
            </ListItemIcon>
            <ListItemText>Forward</ListItemText>
          </MenuItem>
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
                <SvgIcon path={mdiEmailOutline} className={classes.icon} />
              ) : (
                <SvgIcon path={mdiEmailOpenOutline} className={classes.icon} />
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
              <SvgIcon
                path={mdiTrashCanOutline}
                color={theme.palette.error.main}
              />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: 'error' }}>
              Delete
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <Box overflow="auto">
        <EmailThreadEmails emails={emails} />
        {isResponseOpen && (
          <Box padding={2} paddingLeft={9}>
            <Paper elevation={10}>
              <EmailResponseComposeForm
                email={emails[emails.length - 1]}
                responseType={responseType}
                onCancel={() => setIsResponseOpen(false)}
                onSent={() => setIsResponseOpen(false)}
              />
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  )
}
