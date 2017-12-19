import _ from 'underscore'
import store from '../../../../../stores'

export default function (deal) {
  const { deals } = store.getState()
  const { checklists } = deals

  return deal.checklists.some(chId => {
    const checklist = checklists[chId]

    return checklist.checklist_type === 'Buying' && checklist.is_deactivated === false
  })
}
