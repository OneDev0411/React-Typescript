import store from '../../../../../stores'

export default function (deal, filterTab = null) {
  const appState = store.getState()
  const { deals } = appState

  const needs_attentions = []

  if (!deal.checklists) {
    return []
  }

  // filter checklists based on [deal.id] and [deal.tab_name]
  const checklists = _.filter(deals.checklists, list => {
    let matched = (list.deal === deal.id)

    if (!filterTab || filterTab === 'All') {
      return matched
    }

    return matched && list.tab_name === filterTab
  })

  // get tasks of filtered checklists
  checklists.forEach(list => {
    if (!list.tasks) {
      return
    }

    list.tasks.forEach(task_id => {
      const task = deals.tasks[task_id]

      if (task && task.needs_attention) {
        needs_attentions.push(task.id)
      }
    })
  })

  return needs_attentions
}
