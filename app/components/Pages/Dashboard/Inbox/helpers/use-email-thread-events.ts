import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

interface EventBase {
  threads: UUID[]
}
interface GoogleEvent extends EventBase {
  google_credential: UUID
}
interface MicrosoftEvent extends EventBase {
  microsoft_credential: UUID
}
type Event = GoogleEvent | MicrosoftEvent

export default function useEmailThreadEvents(
  handleUpdateEmailThreads: (updatedEmailThreadIds: UUID[]) => void,
  handleDeleteEmailThreads: (deletedEmailThreadIds: UUID[]) => void
) {
  const oAuthAccounts = useSelector(
    (state: IAppState) => state.contacts.oAuthAccounts
  )

  const allAccounts = selectAllConnectedAccounts(oAuthAccounts)

  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    function filterEvent(event: Event): boolean {
      if ('google_credential' in event) {
        return allAccounts.some(({ id }) => id === event.google_credential)
      }

      if ('microsoft_credential' in event) {
        return allAccounts.some(({ id }) => id === event.microsoft_credential)
      }

      return false
    }

    function handleFilteredUpdateEmailThreads(event: Event) {
      filterEvent(event) && handleUpdateEmailThreads(event.threads)
    }
    function handleFilteredDeleteEmailThreads(event: Event) {
      filterEvent(event) && handleDeleteEmailThreads(event.threads)
    }

    socket.on('email_thread:update', handleFilteredUpdateEmailThreads)
    socket.on('email_thread:delete', handleFilteredDeleteEmailThreads)

    return () => {
      socket.off('email_thread:update', handleFilteredUpdateEmailThreads)
      socket.off('email_thread:delete', handleFilteredDeleteEmailThreads)
    }
  }, [allAccounts, handleDeleteEmailThreads, handleUpdateEmailThreads])
}
