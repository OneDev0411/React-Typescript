export function getTaskEnvelopes(envelopes, task) {
  if (!task) {
    return []
  }

  return envelopes
    .filter(envelope =>
      envelope.documents.some(document => {
        if (task.submission && task.submission.id === document.submission) {
          return true
        }

        return (
          Array.isArray(task.room.attachments) &&
          task.room.attachments.some(
            attachment => document.file === attachment.id
          )
        )
      })
    )
    .sort((a, b) => b.created_at - a.created_at)
}
