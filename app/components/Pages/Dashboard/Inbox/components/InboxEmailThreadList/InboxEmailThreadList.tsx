import React, { Ref, useImperativeHandle, useRef } from 'react'

import {
  IGetEmailThreadsFilters,
  getEmailThreads
} from 'models/email/get-email-threads'
import { getEmailThread } from 'models/email/get-email-thread'

import InboxEmailThreadListItem from './components/InboxEmailThreadListItem'
import InfiniteScrollList, {
  InfiniteScrollListHandles
} from '../InfiniteScrollList/InfiniteScrollList'

export interface InboxEmailThreadListHandles {
  updateEmailThread: (emailThreadId: UUID) => Promise<void>
}

interface Props {
  category: 'all' | 'unread' | 'has attachments'
  innerRef: Ref<InboxEmailThreadListHandles>
}

export default function InboxEmailThreadList({ category, innerRef }: Props) {
  const infiniteScrollListInnerRef = useRef<
    InfiniteScrollListHandles<IEmailThread<'messages' | 'contacts'>>
  >(null)

  useImperativeHandle(innerRef, () => ({
    updateEmailThread: async (emailThreadId: UUID): Promise<void> => {
      await infiniteScrollListInnerRef.current!.updateItem(
        emailThreadId,
        'Something went wrong while updating the email in the list. Please reload the page.'
      )
    }
  }))

  return (
    <InfiniteScrollList<IEmailThread<'messages' | 'contacts'>>
      key={category}
      fetchMoreItems={async (from, count) => {
        const filters: IGetEmailThreadsFilters = {
          start: from,
          limit: count
        }

        if (category === 'unread') {
          filters.is_read = false
        }

        if (category === 'has attachments') {
          filters.has_attachments = true
        }

        return getEmailThreads(filters)
      }}
      fetchItem={async id => {
        return getEmailThread(id as UUID)
      }}
      renderItem={item => <InboxEmailThreadListItem emailThread={item} />}
      innerRef={infiniteScrollListInnerRef}
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
