export function getDocumentEnvelopes(envelopes, document) {
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

        return doc.file === document.id
      })
    )
    .sort((a, b) => b.created_at - a.created_at)
}
