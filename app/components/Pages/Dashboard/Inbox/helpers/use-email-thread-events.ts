import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { EmailThreadChangeEvent } from '../types'
import skipEmailThreadChangeEvent from './skip-email-thread-change-event'

export default function useEmailThreadEvents(
  handleUpdateEmailThreads: (updatedEmailThreadIds: UUID[]) => void,
  handleDeleteEmailThreads: (deletedEmailThreadIds: UUID[]) => void
) {
  const allConnectedAccounts = useSelector((state: IAppState) =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )

  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    if (!socket) {
      return
    }

    function handleFilteredUpdateEmailThreads(
      event: EmailThreadChangeEvent
    ): void {
      if (skipEmailThreadChangeEvent(event, allConnectedAccounts)) {
        return
      }

      handleUpdateEmailThreads(event.threads)
    }
    function handleFilteredDeleteEmailThreads(
      event: EmailThreadChangeEvent
    ): void {
      if (skipEmailThreadChangeEvent(event, allConnectedAccounts)) {
        return
      }

      handleDeleteEmailThreads(event.threads)
    }

    socket.on('email_thread:update', handleFilteredUpdateEmailThreads)
    socket.on('email_thread:delete', handleFilteredDeleteEmailThreads)

    return () => {
      socket.off('email_thread:update', handleFilteredUpdateEmailThreads)
      socket.off('email_thread:delete', handleFilteredDeleteEmailThreads)
    }
  }, [allConnectedAccounts, handleDeleteEmailThreads, handleUpdateEmailThreads])
}
