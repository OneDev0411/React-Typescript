import React, { useEffect } from 'react'

import {
  getEmailThreads,
  IGetEmailThreadsFilters
} from 'models/email/get-email-threads'
import { getEmailThread } from 'models/email/get-email-thread'

import InboxEmailThreadListItem from './components/InboxEmailThreadListItem'
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList'

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
  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    async function handleDeleteEmailThreads(deletedEmailThreadIds: UUID[]) {
      // ...
    }
    async function handleUpdateEmailThreads(updatedEmailThreadIds: UUID[]) {
      // ...
    }

    socket.on('email_thread:delete', handleDeleteEmailThreads)
    socket.on('email_thread:update', handleUpdateEmailThreads)

    return () => {
      socket.off('email_thread:delete', handleDeleteEmailThreads)
      socket.off('email_thread:update', handleUpdateEmailThreads)
    }
  }, [])

  return (
    <InfiniteScrollList<IEmailThread<'messages' | 'contacts'>>
      key={category}
      fetchMoreItems={async (from, count) => {
        const filters: IGetEmailThreadsFilters = {
          start: from,
          limit: count
        }

        if (category === 'unread') {
          filters.isRead = false
        }

        if (category === 'has attachments') {
          filters.hasAttachments = true
        }

        return getEmailThreads(filters)
      }}
      fetchItem={async id => {
        return getEmailThread(id as UUID)
      }}
      renderItem={(item, selected) => (
        <InboxEmailThreadListItem emailThread={item} selected={selected} />
      )}
      selectedItemId={selectedEmailThreadId}
      onSelectItem={({ id }) => onSelectEmailThread(id)}
      emptyListMessage={
        category === 'all'
          ? 'No Emails'
          : category === 'unread'
          ? 'No Unread Emails'
          : category === 'has attachments'
          ? 'No Emails With Attachments'
          : 'No Emails'
      }
      fetchErrorMessage="Something went wrong while fetching more emails. Please try again."
    />
  )
}
