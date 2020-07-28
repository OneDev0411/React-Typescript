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

  if (!isBackOffice) {
    const target =
      documentEnvelopes.length === 0
        ? file
        : documentEnvelopes[0].documents.find(doc => doc.file === file.id)

    window.open(
      target ? (target as IDealEnvelopeDocument).pdf.url : file.url,
      '_blank'
    )

    return
  }

  const path =
    documentEnvelopes.length > 0
      ? `envelope/${documentEnvelopes[0].id}`
      : `attachment/${file.id}`

  const url = `/dashboard/deals/${deal.id}/view/${task.id}/${path}`

  browserHistory.push(url)
}
