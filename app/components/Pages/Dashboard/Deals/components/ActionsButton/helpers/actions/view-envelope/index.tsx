import { browserHistory } from 'react-router'

export function viewEnvelope({ deal, envelope, task, isBackOffice }) {
  const [doc] = envelope.documents.filter(d => {
    if (d.task === task.id) {
      return true
    }

    const { attachments } = task.room

    for (const attachment of attachments) {
      if (attachment.id === d.file) {
        return true
      }
    }

    return false
  })

  if (isBackOffice) {
    const url = `/dashboard/deals/${deal.id}/view/${task.id}/envelope/${envelope.id}`

    browserHistory.push(url)

    return
  }

  const { url } = doc.pdf

  window.open(url, '_blank')
}
