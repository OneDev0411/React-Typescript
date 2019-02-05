function normalizeFile(file) {
  return {
    id: file.id,
    name: file.name,
    mime: file.mime,
    url: file.url,
    date: file.created_at
  }
}

function getDocumentsUrl({ deal, task, document, isBackOffice }) {
  if (document.type === 'task' && document.submission) {
    return isBackOffice
      ? [
          {
            ...normalizeFile(task.submission.file),
            url: `/dashboard/deals/${deal.id}/view/${task.id}`
          }
        ]
      : [normalizeFile(task.submission.file)]
  }

  return isBackOffice
    ? [
        {
          ...normalizeFile(document, true),
          url: `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${
            document.id
          }`
        }
      ]
    : [normalizeFile(document, true)]
}

function getTaskDocumentsUrl({ deal, task, isBackOffice }) {
  if (task.submission) {
    return isBackOffice
      ? [
          {
            ...normalizeFile(task.submission.file),
            url: `/dashboard/deals/${deal.id}/view/${task.id}`
          }
        ]
      : [normalizeFile(task.submission.file)]
  }

  const attachments = Array.isArray(task.room.attachments)
    ? task.room.attachments.sort((a, b) => b.created_at - a.created_at)
    : []

  return isBackOffice
    ? attachments.map(attachment => ({
        ...normalizeFile(attachment),
        url: `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${
          attachment.id
        }`
      }))
    : attachments.map(normalizeFile)
}

export function getFileUrl({
  type,
  deal,
  task,
  document,
  isBackOffice = false
}) {
  if (type === 'task') {
    return getTaskDocumentsUrl({ deal, task, document, isBackOffice })
  }

  if (type === 'document') {
    return getDocumentsUrl({ deal, task, document, isBackOffice })
  }

  return []
}
