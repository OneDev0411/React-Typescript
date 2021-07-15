import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { addNotification } from 'components/notification'
import { GOOGLE_CREDENTIAL } from 'constants/oauth-accounts'
import { getEmailThreads } from 'models/email/get-email-threads'
import {
  searchEmailThreads,
  SearchEmailThreadsNext
} from 'models/email/search-email-threads'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import useEmailThreadEvents from '../../helpers/use-email-thread-events'
import InfiniteScrollList from '../InfiniteScrollList'

import InboxEmailThreadListItem from './components/InboxEmailThreadListItem'

const emailThreadFetchCountInitial = 10
const emailThreadFetchCount = 20

interface SearchMetaData {
  searchQuery?: string
  next?: SearchEmailThreadsNext
}

interface Props {
  selectedEmailThreadId?: UUID
  onSelectEmailThread: (emailThreadId: UUID | undefined) => void
  searchQuery?: string
  onSearchStatusChange?: (searching: boolean) => void
  onUpdateEmailThreads?: (emailThreads: IEmailThread<'contacts'>[]) => void
}

export default function InboxEmailThreadList({
  selectedEmailThreadId,
  onSelectEmailThread,
  searchQuery,
  onSearchStatusChange,
  onUpdateEmailThreads
}: Props) {
  const [emailThreads, setEmailThreads] = useState<IEmailThread<'contacts'>[]>(
    []
  )

  const selectedEmailThread = useMemo(
    () => emailThreads.find(({ id }) => id === selectedEmailThreadId),
    [emailThreads, selectedEmailThreadId]
  )

  const searchMetaDataRef = useRef<SearchMetaData>({ searchQuery })

  searchMetaDataRef.current.searchQuery = searchQuery

  useEffect(() => {
    onUpdateEmailThreads && onUpdateEmailThreads([])
    setEmailThreads([])
    searchQuery && onSelectEmailThread(undefined)
    delete searchMetaDataRef.current.next
  }, [onUpdateEmailThreads, onSelectEmailThread, searchQuery])

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

        onUpdateEmailThreads && onUpdateEmailThreads(newEmailThreads)

        return newEmailThreads
      })
    },
    [onUpdateEmailThreads]
  )

  const handleUpdateEmailThreads = useCallback(
    async (updatedEmailThreadIds: UUID[]) => {
      // We don't support including new email threads to the list while searching yet.
      const toBeUpdatedEmailThreadIds = !searchQuery
        ? updatedEmailThreadIds
        : updatedEmailThreadIds.filter(id =>
            emailThreads.some(emailThread => emailThread.id === id)
          )

      try {
        const updatedEmailThreads = await getEmailThreads(
          {
            selection: ['email_thread.snippet'],
            start: 0,
            limit: toBeUpdatedEmailThreadIds.length,
            ids: toBeUpdatedEmailThreadIds
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
    [dispatch, joinEmailThreads, searchQuery, emailThreads]
  )
  const handleDeleteEmailThreads = useCallback(
    (deletedEmailThreadIds: UUID[]) => {
      setEmailThreads(emailThreads => {
        const newEmailThreads = emailThreads.filter(
          ({ id }) => !deletedEmailThreadIds.includes(id)
        )

        onUpdateEmailThreads && onUpdateEmailThreads(newEmailThreads)

        return newEmailThreads
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery]
  )

  useEmailThreadEvents(handleUpdateEmailThreads, handleDeleteEmailThreads)

  async function handleNeedMoreItems(): Promise<boolean> {
    try {
      const getMoreEmailThreads = searchQuery
        ? getMoreEmailThreadsWithSearch
        : getMoreEmailThreadsWithoutSearch

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

    async function getMoreEmailThreadsWithSearch(): Promise<{
      moreEmailThreads: IEmailThread<'contacts'>[]
      finished: boolean
    }> {
      try {
        const searchQuery = searchMetaDataRef.current.searchQuery!

        onSearchStatusChange && onSearchStatusChange(true)

        const { emailThreads, next } = await searchEmailThreads({
          selection: ['email_thread.snippet'],
          searchQuery,
          next: searchMetaDataRef.current.next
        })

        onSearchStatusChange && onSearchStatusChange(false)

        if (searchQuery !== searchMetaDataRef.current.searchQuery) {
          return {
            moreEmailThreads: [],
            finished: false
          }
        }

        searchMetaDataRef.current.next = next

        return {
          moreEmailThreads: emailThreads,
          finished: Object.values(next).filter(Boolean).length === 0
        }
      } catch (reason) {
        onSearchStatusChange && onSearchStatusChange(false)
        throw reason
      }
    }
    async function getMoreEmailThreadsWithoutSearch(): Promise<{
      moreEmailThreads: IEmailThread<'contacts'>[]
      finished: boolean
    }> {
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
  }

  const accounts = useSelector(({ contacts }: IAppState) =>
    selectAllConnectedAccounts(contacts.oAuthAccounts)
  )
  const synchronizingEmails = accounts.some(({ jobs, type }) =>
    jobs?.some(
      ({ job_name, status }) =>
        job_name === (type === GOOGLE_CREDENTIAL ? 'gmail' : 'outlook') &&
        status !== 'success'
    )
  )

  return (
    <InfiniteScrollList
      items={emailThreads}
      onNeedMoreItems={handleNeedMoreItems}
      selectedItem={selectedEmailThread}
      onSelectItem={emailThread =>
        onSelectEmailThread(emailThread && emailThread.id)
      }
      emptyListMessage={synchronizingEmails ? 'Syncing...' : 'No Emails'}
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
