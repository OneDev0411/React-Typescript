import { browserHistory } from 'react-router'

import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'

export function viewFile({
  deal,
  task,
  file,
  envelopes,
  isBackOffice
}: {
  deal: IDeal
  task: IDealTask
  file: IDealFile
  envelopes: IDealEnvelope[]
  isBackOffice: boolean
}) {
  const documentEnvelopes = getDocumentEnvelopes(envelopes, file)
  const envelope = documentEnvelopes.length > 0 ? documentEnvelopes[0] : null

  if (!isBackOffice || !task) {
    const envelopeFile = envelope
      ? envelope.documents.find(doc => doc.file === file.id)
      : undefined

    window.open(envelopeFile ? envelopeFile.pdf.url : file.url, '_blank')

    return
  }

  const path = envelope ? `envelope/${envelope.id}` : `attachment/${file.id}`
  const url = `/dashboard/deals/${deal.id}/view/${task.id}/${path}`

  browserHistory.push(url)
}
