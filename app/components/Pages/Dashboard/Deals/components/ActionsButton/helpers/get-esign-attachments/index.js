export function getEsignAttachments({ type, task, document }) {
  const attachment = {
    task
  }

  // is task (or digital form document)
  if (type === 'task' || (type === 'document' && document.type === 'task')) {
    attachment.type = 'form'
  }

  // is attachment
  if (type === 'document' && document.type === 'file') {
    attachment.file = document
  }

  return [attachment]
}
