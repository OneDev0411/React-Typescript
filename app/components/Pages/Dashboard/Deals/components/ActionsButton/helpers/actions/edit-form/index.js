import { browserHistory } from 'react-router'

export function editForm(props) {
  browserHistory.push(
    `/dashboard/deals/${props.deal.id}/form-edit/${props.task.id}`
  )
}
