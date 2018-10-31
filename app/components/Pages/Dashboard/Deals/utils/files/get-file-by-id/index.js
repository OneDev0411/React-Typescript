import _ from 'underscore'

export function getFileById(fileId, { deal, tasks, taskId }) {
  let file

  if (taskId === 'stash') {
    file = _.find(deal.files, { id: fileId })
  } else {
    const { attachments } = tasks[taskId].room

    file = attachments && _.find(attachments, { id: fileId })
  }

  return file || null
}
