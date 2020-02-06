import React from 'react'

import {
  getEmailThreads,
  IGetEmailThreadsFilters
} from 'models/email/get-email-threads'
import { getEmailThread } from 'models/email/get-email-thread'

import InboxEmailThreadListItem from './components/InboxEmailThreadListItem'
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList'

interface Props {
  category: 'all' | 'unread' | 'has attachments'
}

export default function InboxEmailThreadList({ category }: Props) {
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
