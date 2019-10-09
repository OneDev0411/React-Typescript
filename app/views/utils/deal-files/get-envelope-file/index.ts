export function getEnvelopeFile(
  envelope: IDealEnvelope,
  task: IDealTask
): IDealFile | null {
  // get document index
  let document: IDealEnvelopeDocument | undefined

  if (task.submission !== null) {
    document = envelope.documents.find(
      doc => doc.submission === task.submission!.id
    )
  }

  // if couldn't find the file, try to find that in attachments
  if (!document) {
    document = envelope.documents.find(doc =>
      (task.room.attachments || []).find(file => file.id === doc.file)
    )
  }

  if (!document || !document.pdf) {
    return null
  }

  return {
    ...document.pdf,
    source: 'envelope',
    task: task.id,
    checklist: task.checklist
  }
}
