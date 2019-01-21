function getTaskAttachments(task) {
  const attachments = []

  if (task.submission) {
    attachments.push({
      type: 'form',
      task
    })
  }

  if (Array.isArray(task.room.attachments)) {
    task.room.attachments
      .filter(file => file.mime === 'application/pdf')
      .forEach(file => {
        attachments.push({
          task,
          file
        })
      })
  }

  return attachments
}

function getDocumentAttachment(task, document) {
  if (document.type === 'task' && document.submission) {
    return [
      {
        type: 'form',
        task: document
      }
    ]
  }

  if (document.type === 'file' && document.mime === 'application/pdf') {
    return [
      {
        task,
        file: document
      }
    ]
  }

  return []
}

export function getEsignAttachments({ type, task, document }) {
  if (type === 'task') {
    return getTaskAttachments(task)
  }

  if (type === 'document') {
    return getDocumentAttachment(task, document)
  }

  return []
}
