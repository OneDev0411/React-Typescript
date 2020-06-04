import uniqBy from 'lodash/uniqBy'

import { getLastStates } from 'views/utils/deal-files/get-document-last-state'

export function getAllDealDocuments(
  deal: IDeal,
  envelopes: IDealEnvelope[],
  tasks: IDealTask[],
  includeStashFiles: boolean
): IDealFile[] {
  let attachments: IDealFile[] = []
  let submissions: IDealFile[] = []

  tasks.forEach(task => {
    if (task.submission) {
      const files = getLastStates({
        deal,
        envelopes,
        task
      })

      submissions = [...submissions, ...files]
    }

    // get attachments of task
    if (Array.isArray(task.room.attachments)) {
      task.room.attachments
        .filter(file => file.mime === 'application/pdf')
        .forEach(file => {
          const files = getLastStates({
            deal,
            file,
            envelopes,
            task
          })

          attachments = [...attachments, ...files]
        })
    }
  })

  const stashFiles: IDealFile[] = includeStashFiles
    ? (deal.files || [])
        .filter(file => file.mime === 'application/pdf')
        .map(file => ({
          ...file,
          source: 'attachment',
          task: null,
          checklist: null
        }))
    : []

  return uniqBy(submissions.concat(attachments, stashFiles), file => file.id)
}
