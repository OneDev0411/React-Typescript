interface Params {
  task: IDealTask
  document: IDealTask | IFile
}

export function getEsignAttachments({ task, document }: Params) {
  if (document && document.type === 'file') {
    return getDocumentAttachment(task, document)
  }

  return getTaskAttachments(task)
}

function getTaskAttachments(task: IDealTask): IDealFile[] {
  const attachments: IDealFile[] = []

  if (task.submission) {
    attachments.push({
      ...task.submission.file,
      source: 'submission',
      task: task.id,
      checklist: task.checklist
    })
  }

  if (Array.isArray(task.room.attachments)) {
    task.room.attachments
      .filter(file => file.mime === 'application/pdf')
      .forEach(file => {
        attachments.push({
          ...file,
          source: 'attachment',
          task: task.id,
          checklist: task.checklist
        })
      })
  }

  return attachments
}

function getDocumentAttachment(
  task: IDealTask,
  document: IDealTask | IFile
): IDealFile[] {
  if (document.type === 'task' && document.submission) {
    return [
      {
        ...document.submission.file,
        source: 'submission',
        task: task.id,
        checklist: task.checklist
      }
    ]
  }

  if (document.type === 'file' && document.mime === 'application/pdf') {
    return [
      {
        ...document,
        source: 'attachment',
        task: task.id,
        checklist: task.checklist
      }
    ]
  }

  return []
}
