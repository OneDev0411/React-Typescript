import store from '../../../../stores'

export function getDealFiles(deal) {
  const { deals } = store.getState()
  const { checklists, tasks } = deals

  let files = []

  if (!deal.checklists) {
    return []
  }

  const stashFiles = deal.files || []

  stashFiles.forEach(file => {
    files.push({
      ...file
    })
  })

  deal.checklists.forEach(chId => {
    const checklist = checklists[chId] || []

    if (!checklist.tasks || checklist.is_terminated) {
      return []
    }

    checklist.tasks.forEach(tId => {
      const task = tasks[tId]
      const attachments = task.room.attachments || []

      attachments.forEach(file => {
        files.push({
          ...file,
          task
        })
      })
    })
  })

  return files
}
