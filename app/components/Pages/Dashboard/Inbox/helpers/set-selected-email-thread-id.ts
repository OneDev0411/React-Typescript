import { browserHistory } from 'react-router'

export default function setSelectedEmailThreadId(
  selectedEmailThreadId: UUID | undefined
): void {
  const basePath = '/dashboard/inbox'

  browserHistory.push(
    selectedEmailThreadId ? `${basePath}/${selectedEmailThreadId}` : basePath
  )
}
