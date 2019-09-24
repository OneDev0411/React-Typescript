export function getDocumentEnvelopes(
  envelopes: IDealEnvelope[],
  document: IDealTask | IFile
): IDealEnvelope[] {
  return envelopes
    .filter(envelope =>
      envelope.documents.some(doc => {
        if (
          document.type === 'task' &&
          document.submission &&
          document.submission.id === doc.submission
        ) {
          return true
        }

        return document.type === 'file' && doc.file === document.id
      })
    )
    .sort((a, b) => b.created_at - a.created_at)
}
