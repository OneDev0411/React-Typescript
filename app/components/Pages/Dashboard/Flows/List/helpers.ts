import { FlowAction } from './types'

export function getFlowActions(flow: IBrandFlow): FlowAction[] {
  const actions: FlowAction[] = []

  if (flow.is_editable) {
    actions.push({
      value: 'edit',
      label: 'Edit'
    })
  } else {
    actions.push({
      value: 'view',
      label: 'View'
    })
  }

  actions.push({
    value: 'duplicate',
    label: 'Duplicate'
  })

  return actions
}
