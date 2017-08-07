import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {

    case types.GET_DEALS:
      return action.deals

    case types.CREATE_DEAL:
      return {
        [action.deal.id]: action.deal,
        ...state
      }

    /**
     * why this reducer is so complicated ?
     * this is because of nesting state of deals
     * every deal has one checklist
     * every checklist has many tasks
     * every task has one room
     * every room has many attachments
     * and we need to add a new attachment to the attachments list
     * is it fair ?
     */
    // case types.ADD_ATTACHMENT:
    //   let deal = state[action.deal_id]

    //   let checklists = deal.checklists.map(list => {
    //     if (list.id !== action.checklist_id) {
    //       return list
    //     }

    //     let tasks = list.tasks.map(task => {
    //       if (task.id !== action.task_id) {
    //         return task
    //       }

    //       return {
    //         ...task,
    //         ...{room: {
    //           ...task.room,
    //           attachments: [
    //             ...task.room.attachments || [],
    //             action.file
    //           ]
    //         }}
    //       }
    //     })

    //     return {
    //       ...list,
    //       ...{tasks}
    //     }
    //   })


    //   return {
    //     ...state,
    //     ...{[action.deal_id]: {
    //       ...state[action.deal_id],
    //       ...{checklists}
    //     }}
    //   }

    default:
      return state
  }
}
