import { browserHistory } from 'react-router'

export function viewFile({ deal, task, file, isBackOffice }) {
  if (!isBackOffice) {
    window.open(file.url, '_blank')

    return
  }

  const url = `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${file.id}`

  browserHistory.push(url)
}
