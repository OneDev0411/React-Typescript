import { getDocumentEnvelopes } from '../../../../utils/get-document-envelopes'
import { getEnvelopeFileUrl } from '../../../../utils/get-envelope-file-url'

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
  const submissionEnvelopes = getDocumentEnvelopes(
    data.envelopes,
    data.task
  ).filter(envelope => envelope.status !== 'Voided')

  if (submissionEnvelopes.length > 0) {
    return submissionEnvelopes.map(envelope => ({
      ...normalizeFile(data.task.submission.file),
      name: `Docusign: ${envelope.title}`,
      url: getEnvelopeFileUrl(envelope, data.task),
      openInNewTab: true
    }))
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

  const documentEnvelopes = getDocumentEnvelopes(
    data.envelopes,
    data.document
  ).filter(envelope => envelope.status !== 'Voided')

  if (documentEnvelopes.length > 0) {
    return {
      ...normalizeFile(data.document),
      url: getEnvelopeFileUrl(documentEnvelopes[0], data.task),
      openInNewTab: true
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

  if (submissionUrl.length === 1) {
    return submissionUrl
  }

  const attachments = Array.isArray(data.task.room.attachments)
    ? data.task.room.attachments.sort((a, b) => b.created_at - a.created_at)
    : []

  return [
    ...submissionUrl,
    ...attachments.map(document =>
      getDocumentUrl({
        ...data,
        document
      })
    )
  ]
}
