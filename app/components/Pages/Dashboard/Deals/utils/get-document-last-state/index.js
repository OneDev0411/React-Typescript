import { getDocumentEnvelopes } from '../get-document-envelopes'
import { getEnvelopeFile } from '../get-envelope-file'

/**
 *
 */
export function getDocumentLastState({ type, ...data }) {
  if (type === 'task') {
    return getTasks(data)
  }

  if (type === 'document') {
    return getDocuments(data)
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
    date: file.created_at,
    originalFile: file
  }
}

function normalizeSubmissionFile(document) {
  if (document.type === 'file') {
    return normalizeFile(document)
  }

  const file = document.submission
    ? document.submission.file
    : {
        id: document.id,
        name: document.title,
        mime: 'application/pdf',
        date: document.created_at,
        created_at: document.created_at
      }

  return normalizeFile({
    ...file,
    url: document.pdf_url
  })
}

/**
 *
 */
function getSubmission(data) {
  let url = `/dashboard/deals/${data.deal.id}/view/${data.task.id}`
  const submissionEnvelopes = getDocumentEnvelopes(
    data.envelopes,
    data.task
  ).filter(envelope => envelope.status !== 'Voided')

  if (submissionEnvelopes.length > 0) {
    return submissionEnvelopes.map(envelope => ({
      ...normalizeSubmissionFile(getEnvelopeFile(envelope, data.task)),
      name: `Docusign: ${envelope.title}`,
      openInNewTab: true
    }))
  }

  if (!data.task.form) {
    return []
  }

  return data.isBackOffice
    ? [
        {
          ...normalizeSubmissionFile(data.task),
          url
        }
      ]
    : [normalizeSubmissionFile(data.task)]
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
      ...normalizeFile(getEnvelopeFile(documentEnvelopes[0], data.task)),
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
function getDocuments(data) {
  if (data.document.type === 'task' && data.document.submission) {
    return getSubmission(data)
  }

  return [getDocumentUrl(data)]
}

/**
 *
 */
function getTasks(data) {
  const submission = getSubmission(data)

  if (submission.length === 1) {
    return submission
  }

  const attachments = Array.isArray(data.task.room.attachments)
    ? data.task.room.attachments.sort((a, b) => b.created_at - a.created_at)
    : []

  return [
    ...submission,
    ...attachments.map(document =>
      getDocumentUrl({
        ...data,
        document
      })
    )
  ]
}
