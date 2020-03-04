import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'

import { getEmailThreads } from 'models/email/get-email-threads'

import InfiniteScrollList from '../InfiniteScrollList'
import InboxEmailThreadListItem from './components/InboxEmailThreadListItem'
import useEmailThreadEvents from '../../helpers/use-email-thread-events'

const emailThreadFetchCount = 30

interface Props {
  selectedEmailThreadId?: UUID
  onSelectEmailThread: (emailThreadId: UUID | undefined) => void
  searchQuery?: string
}

export default function InboxEmailThreadList({
  selectedEmailThreadId,
  onSelectEmailThread,
  searchQuery
}: Props) {
  const [emailThreads, setEmailThreads] = useState<IEmailThread<'contacts'>[]>(
    []
  )

  const selectedEmailThread = useMemo(
    () => emailThreads.find(({ id }) => id === selectedEmailThreadId),
    [emailThreads, selectedEmailThreadId]
  )

  useEffect(() => {
    setEmailThreads([])
  }, [searchQuery])

  const dispatch = useDispatch()

  const joinEmailThreads = useCallback(
    (
      updatedEmailThreads: IEmailThread<'contacts'>[],
      mode: 'expand' | 'update'
    ) => {
      setEmailThreads(emailThreads => {
        const lastEmailThread = emailThreads[emailThreads.length - 1]
        const filteredUpdatedEmailThreads = updatedEmailThreads.filter(
          t =>
            mode !== 'update' ||
            !lastEmailThread ||
            lastEmailThread.last_message_date <= t.last_message_date
        )
        const newEmailThreads = emailThreads
          .filter(
            ({ id }) => !filteredUpdatedEmailThreads.some(t => t.id === id)
          )
          .concat(filteredUpdatedEmailThreads)
          .sort((a, b) => b.last_message_date - a.last_message_date)

        return newEmailThreads
      })
    },
    []
  )

  const handleUpdateEmailThreads = useCallback(
    async (updatedEmailThreadIds: UUID[]) => {
      try {
        const updatedEmailThreads = await getEmailThreads(
          {
            selection: ['email_thread.snippet'],
            searchQuery,
            start: 0,
            limit: updatedEmailThreadIds.length,
            ids: updatedEmailThreadIds
          },
          ['contacts']
        )

        joinEmailThreads(updatedEmailThreads, 'update')
      } catch (reason) {
        console.error(reason)
        dispatch(
          addNotification({
            status: 'error',
            message: 'Something went wrong while updating email list.'
          })
        )
      }
    },
    [dispatch, joinEmailThreads, searchQuery]
  )
  const handleDeleteEmailThreads = useCallback(
    (deletedEmailThreadIds: UUID[]) => {
      setEmailThreads(emailThreads =>
        emailThreads.filter(({ id }) => !deletedEmailThreadIds.includes(id))
      )
    },
    []
  )

  useEmailThreadEvents(handleUpdateEmailThreads, handleDeleteEmailThreads)

  return (
    <InfiniteScrollList
      items={emailThreads}
      onNeedMoreItems={async () => {
        try {
          const moreEmailThreads = await getEmailThreads(
            {
              selection: ['email_thread.snippet'],
              searchQuery,
              start: emailThreads.length,
              limit: emailThreadFetchCount
            },
            ['contacts']
          )

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
      emptyListMessage="No Emails"
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
