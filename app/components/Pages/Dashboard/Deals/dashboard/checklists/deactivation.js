import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import {
  createGenericTask,
  changeNeedsAttention,
  updateChecklist
} from '../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../store_actions/confirmation'
import hasPrimaryOffer from '../../utils/has-primary-offer'

class TaskDeactivation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      saving: false
    }
  }

  requestDeactivateChecklist(e) {
    // stop collapsing
    e.stopPropagation()
    const { deal, isBackoffice, confirmation, checklist } = this.props
    const { saving } = this.state

    if (saving === true) {
      return false
    }

    if (checklist.is_deactivated && hasPrimaryOffer(deal)) {
      return confirmation({
        message: 'Please terminate your Primary offer before converting this Back up into primary',
        confirmLabel: 'Okay',
        hideCancelButton: true,
        onConfirm: () => null
      })
    }

    if (isBackoffice) {
      return this.deactivateChecklist()
    }

    const type = checklist.is_deactivated ? 'primary' : 'backup'
    confirmation({
      message: `Notify Admin to make this a ${type} offer.`,
      confirmLabel: 'Yes',
      onConfirm: () => this.deactivateChecklist()
    })
  }

  async deactivateChecklist(e) {
    const {
      isBackoffice,
      deal,
      checklist,
      updateChecklist,
      createGenericTask,
      changeNeedsAttention,
      onRequestCloseDropDownMenu,
      notify
    } = this.props

    const newType = checklist.is_deactivated ? 'primary' : 'backup'

    this.setState({
      saving: true
    })

    // agents can't active/decactive a checklist directly
    if (!isBackoffice) {
      let title = `Notify Admin to make this a ${newType} offer.`
      const task = await createGenericTask(deal.id, title, checklist.id)
      changeNeedsAttention(task.id, true)

      notify({
        message: `Back office has notified to ${newType} this offer`,
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })

      onRequestCloseDropDownMenu()
      this.setState({ saving: false })
      return true
    }

    try {
      await updateChecklist(deal.id, checklist.id, {
        ...checklist,
        is_deactivated: checklist.is_deactivated ? false : true
      })

      notify({
        message: `The checklist has been changed to ${newType} offer`,
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

  getLabel() {
    const { checklist, isBackoffice } = this.props


    if (isBackoffice) {
      return checklist.is_deactivated ?
        'Make this a primary offer' :
        'Make this a back up offer'
    }

    return checklist.is_deactivated ?
      'Notify admin to make primary this offer' :
      'Notify admin to backup this offer'
  }

  render() {
    const { hasPermission } = this.props
    const { saving } = this.state
    const color = '#6b7f93'

    if (!hasPermission) {
      return false
    }

    return (
      <li
        onClick={e => this.requestDeactivateChecklist(e)}
      >
        {
          saving ?
          <span style={{ color }}>
            <i className="fa fa-spin fa-spinner" /> Saving...
          </span> :

          <span style={{ color }}>
            {this.getLabel()}
          </span>
        }
      </li>
    )
  }
}

export default connect(null,
  {
    updateChecklist,
    createGenericTask,
    changeNeedsAttention,
    notify, confirmation })(TaskDeactivation)
