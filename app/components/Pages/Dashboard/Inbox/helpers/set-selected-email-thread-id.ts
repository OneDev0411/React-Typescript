import { browserHistory } from 'react-router'

export default function setSelectedEmailThreadId(
  selectedEmailThreadId: UUID | undefined
) {
  const basePath = '/dashboard/inbox'

  browserHistory.push(
    selectedEmailThreadId ? `${basePath}/${selectedEmailThreadId}` : basePath
  )
}
