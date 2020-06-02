import { getDocumentEnvelopes } from '../get-document-envelopes'
import { getEnvelopeFile } from '../get-envelope-file'

/**
 *
 */
interface Params {
  deal: IDeal
  task: IDealTask
  file?: IFile
  envelopes: IDealEnvelope[]
  isBackOffice?: boolean
}

/**
 *
 * @param data
 */
export function getLastStates(data: Params): IDealFile[] {
  if (data.file) {
    return getDocuments(data)
  }

  return getTaskFile(data)
}

/**
 *
 * @param data
 */
function getTaskFile(data: Params): IDealFile[] {
  const files: IDealFile[] = getTaskLatestFiles(data)

  if (files.length === 1) {
    return files
  }

  const attachments = (data.task.room.attachments || [])
    .sort((a, b) => b.created_at - a.created_at)
    .map(file =>
      getDocumentLatestFile({
        ...data,
        file
      })
    )

  return files.concat(attachments)
}

/**
 *
 * @param data
 */
function getDocuments(data: Params): IDealFile[] {
  return [getDocumentLatestFile(data)]
}

/**
 * returns last state of a submission
 * if the submission file is appeared in an envelope that
 * file has more priority to show since that file is more recent
 * @param data
 */
function getTaskLatestFiles(data: Params): IDealFile[] {
  const envelopes = getDocumentEnvelopes(data.envelopes, data.task).filter(
    envelope => envelope.status !== 'Voided'
  )

  if (envelopes.length > 0) {
    return envelopes
      .filter(envelope => getEnvelopeFile(envelope, data.task))
      .map(envelope => {
        return {
          ...getEnvelopeFile(envelope, data.task),
          name: `${data.task.title} - Signed`
        } as IDealFile
      })
  }

  if (!data.task.submission) {
    return []
  }

  const submissionFile: IDealFile = {
    ...data.task.submission.file,
    url: data.task.pdf_url,
    source: 'submission',
    task: data.task.id,
    checklist: data.task.checklist
  }

  return data.isBackOffice
    ? [
        {
          ...submissionFile,
          internal_url: `/dashboard/deals/${data.deal.id}/view/${data.task.id}`
        }
      ]
    : [submissionFile]
}

/**
 *
 * @param data
 */
function getDocumentLatestFile(data: Params): IDealFile {
  const file = {
    ...data.file,
    task: data.task ? data.task.id : null,
    checklist: data.task ? data.task.checklist : null,
    source: 'attachment'
  } as IDealFile

  const envelopes: IDealEnvelope[] = getDocumentEnvelopes(
    data.envelopes,
    file
  ).filter(envelope => envelope.status !== 'Voided')

  if (envelopes.length > 0) {
    return getEnvelopeFile(envelopes[0], data.task) as IDealFile
  }

  const taskId = data.task ? data.task.id : 'stash'
  const baseUrl = `/dashboard/deals/${data.deal.id}/view/${taskId}`

  return data.isBackOffice
    ? {
        ...file,
        internal_url: `${baseUrl}/attachment/${file.id}`
      }
    : file
}
