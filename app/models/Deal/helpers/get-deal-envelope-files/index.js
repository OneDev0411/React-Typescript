import store from '../../../../stores'

import { getDealFiles } from '../get-deal-files'

function getFile(deal, doc, envelope) {
  const files = getDealFiles(deal, doc)

  const { deals } = store.getState()
  const { checklists, tasks } = deals

  if (doc.file) {
    return files.find(f => f.id === doc.file)
  }

  let file = null

  deal.checklists.some(id => {
    const taskId = (checklists[id].tasks || []).find(taskId => {
      const { submission } = tasks[taskId]

      return submission && submission.id === doc.submission
    })

    if (taskId) {
      file = {
        ...tasks[taskId].submission.file,
        id: envelope.id,
        envelope,
        task: tasks[taskId],
        name: decodeURI(tasks[taskId].submission.file.name)
      }

      return true
    }
  })

  return file
}

export function getDealEnvelopeFiles(deal) {
  const { deals } = store.getState()
  const { envelopes } = deals

  let files = []

  if (!deal.envelopes) {
    return []
  }

  deal.envelopes.forEach(id => {
    const envelope = envelopes[id]

    envelope.documents.map(doc => {
      const file = getFile(deal, doc, envelope)

      files.push(file)
    })
  })

  return files
}
