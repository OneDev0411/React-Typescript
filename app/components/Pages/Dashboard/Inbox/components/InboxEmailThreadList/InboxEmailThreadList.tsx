import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'

import {
  getEmailThreads,
  IGetEmailThreadsFilters
} from 'models/email/get-email-threads'

import InfiniteScrollList from '../InfiniteScrollList'
import InboxEmailThreadListItem from './components/InboxEmailThreadListItem'

const emailThreadFetchCount = 30

interface Props {
  category: 'all' | 'unread' | 'has attachments'
  selectedEmailThreadId?: UUID
  onSelectEmailThread: (emailThreadId: UUID) => void
}

export default function InboxEmailThreadList({
  category,
  selectedEmailThreadId,
  onSelectEmailThread
}: Props) {
  const [emailThreads, setEmailThreads] = useState<
    IEmailThread<'messages' | 'contacts'>[]
  >([])

  const selectedEmailThread = useMemo(
    () => emailThreads.find(({ id }) => id === selectedEmailThreadId),
    [emailThreads, selectedEmailThreadId]
  )

  useEffect(() => {
    setEmailThreads(emailThreads =>
      emailThreads.length === 0 ? emailThreads : []
    )
  }, [category])

  const dispatch = useDispatch()

  function joinEmailThreads(
    updatedEmailThreads: typeof emailThreads,
    mode: 'expand' | 'update'
  ) {
    setEmailThreads(emailThreads => {
      const lastEmailThread = emailThreads[emailThreads.length - 1]
      const filteredUpdatedEmailThreads = updatedEmailThreads.filter(
        t =>
          (mode !== 'update' ||
            !lastEmailThread ||
            lastEmailThread.last_message_date <= t.last_message_date) &&
          (category === 'all' ||
            (category === 'unread' && !t.is_read) ||
            (category === 'has attachments' && t.has_attachments))
      )
      const newEmailThreads = emailThreads
        .filter(({ id }) => !filteredUpdatedEmailThreads.some(t => t.id === id))
        .concat(filteredUpdatedEmailThreads)
        .sort((a, b) => b.last_message_date - a.last_message_date)

      return newEmailThreads
    })
  }

  // useEffect(() => {
  //   const socket: SocketIOClient.Socket = (window as any).socket

  //   async function handleUpdateEmailThreads(updatedEmailThreadIds: UUID[]) {
  //     infiniteScrollListInnerRef.current!.updateItems(updatedEmailThreadIds)
  //   }
  //   async function handleDeleteEmailThreads(deletedEmailThreadIds: UUID[]) {
  //     infiniteScrollListInnerRef.current!.deleteItems(deletedEmailThreadIds)
  //   }

  //   socket.on('email_thread:update', handleUpdateEmailThreads)
  //   socket.on('email_thread:delete', handleDeleteEmailThreads)

  //   return () => {
  //     socket.off('email_thread:update', handleUpdateEmailThreads)
  //     socket.off('email_thread:delete', handleDeleteEmailThreads)
  //   }
  // }, [])

  return (
    <InfiniteScrollList
      items={emailThreads}
      onNeedMoreItems={async () => {
        const filters: IGetEmailThreadsFilters = {
          start: emailThreads.length,
          limit: emailThreadFetchCount
        }

        if (category === 'unread') {
          filters.isRead = false
        }

        if (category === 'has attachments') {
          filters.hasAttachments = true
        }

        try {
          const moreEmailThreads = await getEmailThreads(filters)

          joinEmailThreads(moreEmailThreads, 'expand')

          return moreEmailThreads.length < emailThreadFetchCount
        } catch (reason) {
          console.error(reason)
          dispatch(
            addNotification({
              status: 'error',
              message:
                'Something went wrong while fetching more emails. Please try again.'
            })
          )
          throw reason
        }
      }}
      selectedItem={selectedEmailThread}
      onSelectItem={emailThread =>
        emailThread && onSelectEmailThread(emailThread.id)
      }
      emptyListMessage={
        category === 'all'
          ? 'No Emails'
          : category === 'unread'
          ? 'No Unread Emails'
          : category === 'has attachments'
          ? 'No Emails With Attachments'
          : 'No Emails'
      }
      itemKey={(emailThread, index) => emailThread.id}
      renderItem={(emailThread, selected) => (
        <InboxEmailThreadListItem
          emailThread={emailThread}
          selected={selected}
        />
      )}
    />
  )
}
