import { getDocumentEnvelopes } from '../get-document-envelopes'
import { getEnvelopeFile } from '../get-envelope-file'

/**
 *
 */
interface Params {
  deal: IDeal
  task: IDealTask
  document?: IFile | IDealTask
  envelopes: IDealEnvelope[]
  isBackOffice?: boolean
}

/**
 *
 * @param data
 */
export function getLastStates(data: Params): IDealFile[] {
  if (data.document && data.document.type === 'file') {
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

  // if (files.length === 1) {
  //   return files
  // }

  const attachments = (data.task.room.attachments || [])
    .sort((a, b) => b.created_at - a.created_at)
    .map(document =>
      getDocumentLatestFile({
        ...data,
        document
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
          name: `Docusign: ${envelope.title}`,
          source: 'envelope'
        } as IDealFile
      })
  }

  if (!data.task.submission) {
    return []
  }

  const submissionFile: IDealFile = {
    ...data.task.submission.file,
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
  const document = {
    ...data.document,
    task: data.task.id,
    checklist: data.task.checklist,
    source: 'attachment'
  } as IDealFile

  const envelopes: IDealEnvelope[] = getDocumentEnvelopes(
    data.envelopes,
    document
  ).filter(envelope => envelope.status !== 'Voided')

  if (envelopes.length > 0) {
    return getEnvelopeFile(envelopes[0], data.task) as IDealFile
  }

  const taskId = data.task ? data.task.id : 'stash'
  const baseUrl = `/dashboard/deals/${data.deal.id}/view/${taskId}`

  return data.isBackOffice
    ? {
        ...document,
        internal_url: `${baseUrl}/attachment/${document.id}`
      }
    : document
}
