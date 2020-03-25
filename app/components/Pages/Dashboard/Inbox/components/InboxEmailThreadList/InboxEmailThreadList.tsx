import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'

import { getEmailThreads } from 'models/email/get-email-threads'

import InfiniteScrollList from '../InfiniteScrollList'
import InboxEmailThreadListItem from './components/InboxEmailThreadListItem'
import useEmailThreadEvents from '../../helpers/use-email-thread-events'
import useSearchEmailThreads from './helpers/use-search-email-threads'

const emailThreadFetchCountInitial = 10
const emailThreadFetchCount = 20

interface Props {
  selectedEmailThreadId?: UUID
  onSelectEmailThread: (emailThreadId: UUID | undefined) => void
  searchQuery?: string
  onEmailThreadsUpdate?: (emailThreads: IEmailThread<'contacts'>[]) => void
}

export default function InboxEmailThreadList({
  selectedEmailThreadId,
  onSelectEmailThread,
  searchQuery,
  onEmailThreadsUpdate
}: Props) {
  const [emailThreads, setEmailThreads] = useState<IEmailThread<'contacts'>[]>(
    []
  )

  const searchEmailThreads = useSearchEmailThreads(searchQuery || '')

  const selectedEmailThread = useMemo(
    () => emailThreads.find(({ id }) => id === selectedEmailThreadId),
    [emailThreads, selectedEmailThreadId]
  )

  useEffect(() => {
    onEmailThreadsUpdate && onEmailThreadsUpdate([])
    setEmailThreads([])
  }, [onEmailThreadsUpdate, searchQuery])

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

        onEmailThreadsUpdate && onEmailThreadsUpdate(newEmailThreads)

        return newEmailThreads
      })
    },
    [onEmailThreadsUpdate]
  )

  const handleUpdateEmailThreads = useCallback(
    async (updatedEmailThreadIds: UUID[]) => {
      if (searchQuery) {
        return
      }

      try {
        const updatedEmailThreads = await getEmailThreads(
          {
            selection: ['email_thread.snippet'],
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
      if (searchQuery) {
        return
      }

      setEmailThreads(emailThreads =>
        emailThreads.filter(({ id }) => !deletedEmailThreadIds.includes(id))
      )
    },
    [searchQuery]
  )

  useEmailThreadEvents(handleUpdateEmailThreads, handleDeleteEmailThreads)

  const getMoreEmailThreads = searchQuery
    ? async function getMoreEmailThreadsBySearch() {
        const {
          emailThreads: moreEmailThreads,
          finished
        } = await searchEmailThreads(['email_thread.snippet'])

        return { moreEmailThreads, finished }
      }
    : async function getMoreEmailThreadsWithoutSearch() {
        const count =
          emailThreads.length === 0
            ? emailThreadFetchCountInitial
            : emailThreadFetchCount
        const moreEmailThreads = await getEmailThreads(
          {
            selection: ['email_thread.snippet'],
            start: emailThreads.length,
            limit: count
          },
          ['contacts']
        )
        const finished = moreEmailThreads.length < count

        return { moreEmailThreads, finished }
      }

  return (
    <InfiniteScrollList
      items={emailThreads}
      onNeedMoreItems={async () => {
        try {
          const { moreEmailThreads, finished } = await getMoreEmailThreads()

          joinEmailThreads(moreEmailThreads, 'expand')

          return finished
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
        onSelectEmailThread(emailThread && emailThread.id)
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
