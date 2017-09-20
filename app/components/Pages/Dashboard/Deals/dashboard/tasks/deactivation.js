import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { updateChecklist } from '../../../../../../store_actions/deals'

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

    const { dealId, checklist, updateChecklist, onRequestCloseDropDownMenu, notify} = this.props

    this.setState({ saving: true })

    try {
      await updateChecklist(dealId, checklist.id, {
        ...checklist,
        is_deactivated: checklist.is_deactivated ? false : true
      })

      const newType = checklist.is_deactivated ? 'Active' : 'Backup'
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
              'Make this an active contract' :
              'Make this a backup contract'
            }
          </span>
        }
      </li>
    )
  }
}

export default connect(null, { updateChecklist, notify })(TaskDeactivation)
