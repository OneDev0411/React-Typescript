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

        return (task.room.attachments || []).some(
          attachment => document.file === attachment.id
        )
      })
    )
    .sort((a, b) => b.created_at - a.created_at)
}
