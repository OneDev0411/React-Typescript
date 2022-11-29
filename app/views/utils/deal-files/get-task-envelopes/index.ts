export function getTaskEnvelopes(
  envelopes: IDealEnvelope[],
  task: IDealTask
): IDealEnvelope[] {
  if (!task) {
    return []
  }

  return envelopes
    .filter(envelope =>
      envelope.documents.some(document => {
        if (task.id === document.task) {
          return true
        }

        if (isEnvelopeDocumentPartOfTask(envelopes, task, document)) {
          return true
        }

        return (task.room.attachments || []).some(
          attachment => document.file === attachment.id
        )
      })
    )
    .sort((a, b) => b.created_at - a.created_at)
}

/**
 * Checks if the given envelope document is part of this task's envelope
 * When a user creates an envelope from an existing envelope, this scenario occurs
 * More info: https://gitlab.com/rechat/web/-/issues/6979
 *
 * @param envelopes list of all envelopes
 * @param task the given deal task
 * @param document the document of an envelope
 * @returns whether the document belongs to an envelope in a given task
 */
function isEnvelopeDocumentPartOfTask(
  envelopes: IDealEnvelope[],
  task: IDealTask,
  document: IDealEnvelopeDocument
): boolean {
  const envelope = envelopes.find(envelope =>
    envelope.documents.some(doc => doc.pdf.id === document.file)
  )

  return (
    envelope?.documents.some(document => document.task === task.id) ?? false
  )
}
