interface Params {
  type: 'task' | 'document'
  task: IDealTask
  document: IDealTask | IFile
}

interface Attachments {
  type: 'form' | 'file'
  task: IDealTask
  file: IFile
}

export function getEsignAttachments({ type, task, document }: Params) {
  if (type === 'task') {
    return getTaskAttachments(task)
  }

  if (type === 'document') {
    return getDocumentAttachment(task, document)
  }

  return []
}

function getTaskAttachments(task: IDealTask): Attachments[] {
  const attachments: Attachments[] = []

  if (task.submission) {
    attachments.push({
      type: 'form',
      task,
      file: task.submission.file
    })
  }

  if (Array.isArray(task.room.attachments)) {
    task.room.attachments
      .filter(file => file.mime === 'application/pdf')
      .forEach(file => {
        attachments.push({
          type: 'file',
          task,
          file
        })
      })
  }

  return attachments
}

function getDocumentAttachment(
  task: IDealTask,
  document: IDealTask | IFile
): Attachments[] {
  if (document.type === 'task' && document.submission) {
    return [
      {
        type: 'form',
        task: document,
        file: document.submission.file
      }
    ]
  }

  if (document.type === 'file' && document.mime === 'application/pdf') {
    return [
      {
        type: 'file',
        task,
        file: document
      }
    ]
  }

  return []
}
