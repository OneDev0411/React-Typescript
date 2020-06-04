import { selectDealTasks } from 'reducers/deals/tasks'

// NOTE: this is actually written by Ramin
export function getFileById(id, { deal, checklists, tasks }) {
  const dealTasks = selectDealTasks(deal, checklists, tasks, true)

  const files = (dealTasks || []).flatMap(task => {
    return (task.room.attachments || []).concat(
      (task.submission && task.submission.file) || []
    )
  })

  return files.concat(deal.files || []).find(file => file.id === id)
}
