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

    const {
      deal,
      checklist,
      updateChecklist,
      onRequestCloseDropDownMenu,
      notify
    } = this.props

    this.setState({ saving: true })

    try {
      await updateChecklist(deal.id, checklist.id, {
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
      this.setState({ saving: false })
      onRequestCloseDropDownMenu()
    }
  }

  render() {
    const { checklist, hasPermission } = this.props
    const { saving } = this.state
    const color = '#d0011b'

    if (!hasPermission) {
      return false
    }

    return (
      <li
        onClick={e => this.terminateChecklist(e)}
      >
        {
          saving ?
          <span style={{ color }}>
            {
              checklist.is_terminated ?
              <span><i className="fa fa-spin fa-spinner" /> Activating...</span> :
              <span><i className="fa fa-spin fa-spinner" /> Terminating...</span>
            }
          </span> :
          <span style={{ color }}>
            { checklist.is_terminated ? 'Active' : 'Terminate' }
          </span>
        }
      </li>
    )
  }
}

export default connect(null, { updateChecklist, notify })(TaskTermination)
