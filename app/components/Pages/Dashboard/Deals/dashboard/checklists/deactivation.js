import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import {
  createGenericTask,
  changeNeedsAttention,
  updateChecklist
} from '../../../../../../store_actions/deals'

class TaskDeactivation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      saving: false
    }
  }

  async deactivateChecklist(e) {
    // stop collapsing
    e.stopPropagation()

    if (this.state.saving === true) {
      return false
    }

    const {
      isBackoffice,
      dealId,
      checklist,
      updateChecklist,
      createGenericTask,
      changeNeedsAttention,
      onRequestCloseDropDownMenu,
      notify
    } = this.props

    const newType = checklist.is_deactivated ? 'Active' : 'Backup'

    this.setState({ saving: true })

    // agents can't active/decactive a checklist directly
    if (!isBackoffice) {
      let title = `Please make this checklist ${newType.toLowerCase()}`
      const task = await createGenericTask(dealId, title, checklist.id)
      changeNeedsAttention(task.id, true)

      notify({
        message: `Back office has been notified to make ${newType.toLowerCase()} this checklist`,
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })

      onRequestCloseDropDownMenu()
      this.setState({ saving: false })
      return true
    }

    try {
      await updateChecklist(dealId, checklist.id, {
        ...checklist,
        is_deactivated: checklist.is_deactivated ? false : true
      })

      notify({
        message: `The checklist has been changed to ${newType} contract`,
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
    const color = '#6b7f93'

    if (!hasPermission) {
      return false
    }

    return (
      <li
        onClick={e => this.deactivateChecklist(e)}
      >
        {
          saving ?
          <span style={{ color }}>
            <i className="fa fa-spin fa-spinner" /> Saving...
          </span> :

          <span style={{ color }}>
            {
              checklist.is_deactivated ?
              'Make this a primary contract' :
              'Make this a backup contract'
            }
          </span>
        }
      </li>
    )
  }
}

export default connect(null,
  { updateChecklist, createGenericTask, changeNeedsAttention, notify })(TaskDeactivation)
