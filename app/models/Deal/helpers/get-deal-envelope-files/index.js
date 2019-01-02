import store from '../../../../stores'

import { getDealFiles } from '../get-deal-files'

function getFile(deal, doc, envelope) {
  const files = getDealFiles(deal)

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

  /* there is a critical bug that breaks some envelopes when user
   * tries to move documents of the envelope into the stash or another
   * task. this "filter" temporary fiexs the bug until Emil find a
   * workaround for that
   */
  return files.filter(file => !!file)
}
