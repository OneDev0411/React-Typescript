import { getDocumentEnvelopes } from '../../../../utils/get-document-envelopes'

/**
 *
 */
export function getFileUrl({ type, ...data }) {
  if (type === 'task') {
    return getTaskUrls(data)
  }

  if (type === 'document') {
    return getDocumentUrls(data)
  }

  return []
}

/**
 *
 */
function normalizeFile(file) {
  return {
    id: file.id,
    name: file.name,
    mime: file.mime,
    url: file.url,
    date: file.created_at
  }
}

/**
 *
 */
function getSubmissionUrl(data) {
  if (!data.task.submission) {
    return []
  }

  let url = `/dashboard/deals/${data.deal.id}/view/${data.task.id}`
  const submissionEnvelopes = getDocumentEnvelopes(data.envelopes, data.task)

  if (submissionEnvelopes.length > 0) {
    return [
      {
        ...normalizeFile(data.task.submission.file),
        url: `${url}/envelope/${submissionEnvelopes[0].id}`,
        blankTarget: false
      }
    ]
  }

  return data.isBackOffice
    ? [
        {
          ...normalizeFile(data.task.submission.file),
          url
        }
      ]
    : [normalizeFile(data.task.submission.file)]
}

/**
 *
 */
function getDocumentUrl(data) {
  const taskId = data.task ? data.task.id : 'stash'
  const baseUrl = `/dashboard/deals/${data.deal.id}/view/${taskId}`

  const documentEnvelopes = getDocumentEnvelopes(data.envelopes, data.document)

  if (documentEnvelopes.length > 0) {
    const item = documentEnvelopes[0]

    return {
      ...normalizeFile(data.document),
      url: `${baseUrl}/envelope/${item.id}`,
      blankTarget: false
    }
  }

  return data.isBackOffice
    ? {
        ...normalizeFile(data.document),
        url: `${baseUrl}/attachment/${data.document.id}`
      }
    : normalizeFile(data.document)
}

/**
 *
 */
function getDocumentUrls(data) {
  if (data.document.type === 'task' && data.document.submission) {
    return getSubmissionUrl(data)
  }

  return [getDocumentUrl(data)]
}

/**
 *
 */
function getTaskUrls(data) {
  const submissionUrl = getSubmissionUrl(data)

  if (submissionUrl.length > 0) {
    return submissionUrl
  }

  const attachments = Array.isArray(data.task.room.attachments)
    ? data.task.room.attachments.sort((a, b) => b.created_at - a.created_at)
    : []

  return attachments.map(document =>
    getDocumentUrl({
      ...data,
      document
    })
  )
}
