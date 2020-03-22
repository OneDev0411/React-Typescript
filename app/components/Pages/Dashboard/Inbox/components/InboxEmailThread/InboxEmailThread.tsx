import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Box, IconButton, Typography, Avatar } from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import { addNotification } from 'reapop'

import { getEmailThread } from 'models/email/get-email-thread'

import { normalizeThreadMessageToThreadEmail } from 'components/EmailThread/helpers/normalize-to-email-thread-email'
import { EmailThreadEmails } from 'components/EmailThread'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { getNameInitials } from 'utils/helpers'

import markEmailThreadAsRead from '../../helpers/mark-email-thread-as-read'
import useEmailThreadEvents from '../../helpers/use-email-thread-events'
import NoContentMessage from '../NoContentMessage'

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

  const dispatch = useDispatch()

  const fetchEmailThread = useCallback(async () => {
    if (emailThreadId) {
      setStatus('fetching')

      try {
        const emailThread = await getEmailThread(emailThreadId)

        setEmailThread(emailThread)
        setStatus('fetched')

        if (!emailThread.is_read) {
          try {
            await markEmailThreadAsRead(emailThread)
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
      <Box display="flex" alignItems="center" paddingY={3.5} paddingLeft={2}>
        <Box width={0} flexGrow={1} paddingLeft={7.5}>
          <Typography variant="subtitle1" noWrap>
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
        <IconButton
          onClick={() => {
            setEmailThread(null)
            setStatus('empty')
            onClose()
          }}
        >
          <CloseIcon size="small" />
        </IconButton>
      </Box>
      <Box overflow="auto">
        <EmailThreadEmails emails={emails} />
      </Box>
    </Box>
  )
}
