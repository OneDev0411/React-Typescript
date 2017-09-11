import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { updateChecklist } from '../../../../../../store_actions/deals'

class TaskTermination extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      saving: false
    }
  }

  async terminateChecklist(e) {
    // stop collapsing
    e.stopPropagation()

    if (this.state.saving === true) {
      return false
    }

    const { dealId, checklist, updateChecklist, onCloseDropDownMenu, notify} = this.props

    if (checklist.is_terminatable === false) {
      return notify({
        title: 'Access denied',
        message: 'This checklist is not terminatable',
        status: 'error',
        dismissible: true,
        dismissAfter: 5000
      })
    }

    this.setState({ saving: true })

    try {
      await updateChecklist(dealId, checklist.id, {
        ...checklist,
        is_terminated: checklist.is_terminated ? false : true
      })

      const action = checklist.is_terminated ? 'activated' : 'terminated'
      notify({
        title: action,
        message: `The checklist has been ${action}`,
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })

    } catch(e) {
      notify({
        title: 'Error!',
        message: 'Can not complete this action. please retry',
        status: 'error',
        dismissible: true,
        dismissAfter: 5000
      })
    } finally {
      onCloseDropDownMenu()
    }
  }

  render() {
    const { checklist } = this.props
    const { saving } = this.state

    return (
      <li
        onClick={e => this.terminateChecklist(e)}
      >
        {
          saving ?
          <span>{ checklist.is_terminated ? 'Activating...' : 'Terminating...' }</span> :
          <span>{ checklist.is_terminated ? 'Active' : 'Terminate' }</span>
        }
      </li>
    )
  }
}

export default connect(null, { updateChecklist, notify })(TaskTermination)
