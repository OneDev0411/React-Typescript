import { browserHistory } from 'react-router'

export function viewEnvelope({
  deal,
  envelope,
  task,
  isBackOffice
}: {
  deal: IDeal
  envelope: IDealEnvelope
  task: IDealTask
  isBackOffice: boolean
}) {
  const [doc] = envelope.documents.filter(document => {
    if (document.task === task.id) {
      return true
    }

    const { attachments } = task.room

    return (attachments || []).some(attachment => {
      return attachment.id === document.file
    })
  })

  if (isBackOffice) {
    const url = `/dashboard/deals/${deal.id}/view/${task.id}/envelope/${envelope.id}`

    browserHistory.push(url)

    return
  }

  const { url } = doc.pdf

  window.open(url, '_blank')
}
