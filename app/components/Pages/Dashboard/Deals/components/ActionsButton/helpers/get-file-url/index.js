function getDocumentsUrl({ deal, task, document, isBackOffice }) {
  if (document.type === 'task' && document.submission) {
    return isBackOffice
      ? [
          {
            id: task.submission.file.id,
            name: task.submission.file.name,
            url: `/dashboard/deals/${deal.id}/view/${task.id}`
          }
        ]
      : [
          {
            id: task.submission.file.id,
            name: task.submission.file.name,
            url: task.submission.file.url
          }
        ]
  }

  return isBackOffice
    ? [
        {
          id: document.id,
          name: document.name,
          url: `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${
            document.id
          }`
        }
      ]
    : [{ id: document.id, name: document.name, url: document.url }]
}

function getTaskDocumentsUrl({ deal, task, isBackOffice }) {
  if (task.submission) {
    return isBackOffice
      ? [
          {
            id: task.submission.file.id,
            name: task.submission.file.name,
            url: `/dashboard/deals/${deal.id}/view/${task.id}`
          }
        ]
      : [
          {
            id: task.submission.file.id,
            name: task.submission.file.name,
            url: task.submission.file.url
          }
        ]
  }

  const attachments = task.room.attachments.sort(
    (a, b) => b.created_at - a.created_at
  )

  return isBackOffice
    ? [
        {
          id: attachments[0].id,
          name: attachments[0].name,
          url: `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${
            attachments[0].id
          }`
        }
      ]
    : [
        {
          id: attachments[0].id,
          name: attachments[0].name,
          url: attachments[0].url
        }
      ]
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
