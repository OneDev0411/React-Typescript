import { getDocumentEnvelopes } from '../get-document-envelopes'
import { getEnvelopeFile } from '../get-envelope-file'

/**
 *
 */
interface Params {
  type: 'task' | 'document'
  deal: IDeal
  task: IDealTask
  document: IFile | IDealTask
  envelopes: IDealEnvelope[]
  isBackOffice?: boolean
}

/**
 *
 * @param data
 */
export function getLastStates(data: Params): IFile[] {
  if (
    data.type === 'task' ||
    (data.document.type === 'task' && data.document.submission)
  ) {
    return getTaskFile(data)
  }

  if (data.type === 'document') {
    return getDocuments(data)
  }

  return []
}

/**
 *
 * @param data
 */
function getTaskFile(data: Params): IFile[] {
  const files: IFile[] = getTaskLatestFiles(data)

  if (files.length > 0) {
    return files
  }

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
function getDocuments(data: Params): IFile[] {
  return [getDocumentLatestFile(data)]
}

/**
 * returns last state of a submission
 * if the submission file is appeared in an envelope that
 * file has more priority to show since that file is more recent
 * @param data
 */
function getTaskLatestFiles(data: Params): IFile[] {
  const envelopes = getDocumentEnvelopes(data.envelopes, data.task).filter(
    envelope => envelope.status !== 'Voided'
  )

  if (envelopes.length > 0) {
    return envelopes
      .filter(envelope => getEnvelopeFile(envelope, data.task))
      .map(envelope => {
        return {
          ...getEnvelopeFile(envelope, data.task),
          name: `Docusign: ${envelope.title}`
        } as IFile
      })
  }

  if (!data.task.submission) {
    return []
  }

  return data.isBackOffice
    ? [
        {
          ...data.task.submission.file,
          url: `/dashboard/deals/${data.deal.id}/view/${data.task.id}`
        }
      ]
    : [data.task.submission.file]
}

/**
 *
 * @param data
 */
function getDocumentLatestFile(data: Params): IFile {
  const document = data.document as IFile

  const envelopes: IDealEnvelope[] = getDocumentEnvelopes(
    data.envelopes,
    document
  ).filter(envelope => envelope.status !== 'Voided')

  if (envelopes.length > 0) {
    return getEnvelopeFile(envelopes[0], data.task) as IFile
  }

  const taskId = data.task ? data.task.id : 'stash'
  const baseUrl = `/dashboard/deals/${data.deal.id}/view/${taskId}`

  return data.isBackOffice
    ? {
        ...document,
        url: `${baseUrl}/attachment/${document.id}`
      }
    : document
}
