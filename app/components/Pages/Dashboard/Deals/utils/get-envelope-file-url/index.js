export function getEnvelopeFileUrl(envelope, task) {
  // get document index
  let document = null

  if (task.submission) {
    document = envelope.documents.find(
      doc => doc.submission === task.submission.id
    )
  }

  // if couldn't find the file, try to find that in attachments
  if (!document) {
    document = envelope.documents.find(doc =>
      task.room.attachments.find(file => file.id === doc.file)
    )
  }

  if (!document || !document.pdf) {
    return null
  }

  return document.pdf.url
}
