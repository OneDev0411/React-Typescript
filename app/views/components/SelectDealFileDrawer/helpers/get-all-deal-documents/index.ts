import { getDocumentLastState } from 'deals/utils/get-document-last-state'

import { normalizeAttachment } from '../normalize-attachment'

export function getAllDealDocuments(deal, envelopes, tasks, includeStashFiles) {
  let attachments: any[] = []
  let submissions: any[] = []

  tasks.forEach(task => {
    if (task.submission) {
      const files = getDocumentLastState({
        type: 'task',
        deal,
        envelopes,
        task
      }).map(({ originalFile: file }) =>
        normalizeAttachment({
          type: 'form',
          file,
          task
        })
      )

      submissions = [...submissions, ...files]
    }

    // get attachments of task
    if (Array.isArray(task.room.attachments)) {
      task.room.attachments
        .filter(file => file.mime === 'application/pdf')
        .forEach(file => {
          const files = getDocumentLastState({
            type: 'document',
            deal,
            document: file,
            envelopes,
            task
          }).map(({ originalFile: file }) =>
            normalizeAttachment({
              type: 'file',
              task,
              file
            })
          )

          attachments = [...attachments, ...files]
        })
    }
  })

  return [...submissions, ...attachments].concat(
    includeStashFiles
      ? (deal.files || [])
          .filter(file => file.mime === 'application/pdf')
          .map(file =>
            normalizeAttachment({
              type: 'file',
              task: null,
              file
            })
          )
      : []
  )
}
