import { useEffect } from 'react'

import { selectAllConnectedAccounts } from '../../../../../reducers/contacts/oAuthAccounts'
import useTypedSelector from '../../../../../hooks/use-typed-selector'

import { EmailThreadChangeEvent } from '../types'
import skipEmailThreadChangeEvent from './skip-email-thread-change-event'

export default function useEmailThreadEvents(
  handleUpdateEmailThreads: (updatedEmailThreadIds: UUID[]) => void,
  handleDeleteEmailThreads: (deletedEmailThreadIds: UUID[]) => void
) {
  const allConnectedAccounts = useTypedSelector(state =>
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
