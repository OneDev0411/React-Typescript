import { useEffect } from 'react'

export default function useEmailThreadEvents(
  handleUpdateEmailThreads: (updatedEmailThreadIds: UUID[]) => void,
  handleDeleteEmailThreads: (deletedEmailThreadIds: UUID[]) => void
) {
  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    socket.on('email_thread:update', handleUpdateEmailThreads)
    socket.on('email_thread:delete', handleDeleteEmailThreads)

    return () => {
      socket.off('email_thread:update', handleUpdateEmailThreads)
      socket.off('email_thread:delete', handleDeleteEmailThreads)
    }
  }, [handleDeleteEmailThreads, handleUpdateEmailThreads])
}
