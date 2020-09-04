export function getEnvelopeAttachments(
  task: IDealTask,
  envelope: IDealEnvelope
) {
  return (envelope.documents || []).filter(document => {
    if (document.task === task.id) {
      return true
    }

    return (task.room?.attachments || []).some(attachment => {
      return attachment.id === document.file
    })
  })
}
