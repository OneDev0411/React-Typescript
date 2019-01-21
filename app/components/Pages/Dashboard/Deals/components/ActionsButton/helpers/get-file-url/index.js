function getDocumentsUrl({ deal, task, document, isBackOffice }) {
  if (document.type === 'task' && document.submission) {
    return isBackOffice
      ? [{ url: `/dashboard/deals/${deal.id}/view/${document.id}` }]
      : [{ url: document.submission.file.url }]
  }

  return isBackOffice
    ? [
        {
          url: `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${
            document.id
          }`
        }
      ]
    : [{ url: document.url }]
}

function getTaskDocumentsUrl({ deal, task, isBackOffice }) {
  if (task.submission) {
    return isBackOffice
      ? [{ url: `/dashboard/deals/${deal.id}/view/${task.id}` }]
      : [{ url: task.submission.file.url }]
  }

  const attachments = task.room.attachments.sort(
    (a, b) => b.created_at - a.created_at
  )

  return isBackOffice
    ? [
        {
          url: `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${
            attachments[0].id
          }`
        }
      ]
    : [{ url: attachments[0].url }]
}

export function getFileUrl({ type, deal, task, document, isBackOffice }) {
  if (type === 'task') {
    return getTaskDocumentsUrl({ deal, task, document, isBackOffice })
  }

  if (type === 'document') {
    return getDocumentsUrl({ deal, task, document, isBackOffice })
  }

  return []
}
