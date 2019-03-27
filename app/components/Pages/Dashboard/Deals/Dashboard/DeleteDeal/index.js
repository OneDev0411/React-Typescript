import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { getDealChecklists } from 'reducers/deals/checklists'
import { deleteDeal } from 'actions/deals'
import { confirmation } from 'actions/confirmation'
import { getActiveChecklist } from 'models/Deal/helpers/get-active-checklist'

import ActionButton from 'components/Button/ActionButton'

import { createAdminRequestTask } from '../../utils/create-request-task'

class DeleteDeal extends React.Component {
  state = {
    isDeleting: false
  }

  handleClick = () => {
    if (
      this.props.isBackOffice === false &&
      this.props.deal.is_draft === false
    ) {
      this.props.confirmation({
        message: 'Delete Deal',
        description: 'Only your back office can delete this deal.',
        needsUserEntry: true,
        inputDefaultValue: 'Please remove this deal.',
        confirmLabel: 'Yes, Delete',
        onConfirm: this.handleSendRequest
      })

      return
    }

    this.props.confirmation({
      message: 'Delete Deal',
      description: 'Are you sure you want to delete this deal?',
      confirmLabel: 'Yes, Delete',
      onConfirm: this.handleDelete
    })
  }

  handleSendRequest = () => {
    const checklist = getActiveChecklist(this.props.deal, this.props.checklists)

    createAdminRequestTask({
      checklist,
      userId: this.props.user.id,
      dealId: this.props.deal.id,
      taskTitle: 'Remove deal',
      taskComment: 'Hello, Please remove this deal',
      notifyMessage: 'Back office has been notified to remove the deal'
    })
  }

  handleDelete = async () => {
    this.setState({
      isDeleting: true
    })

    try {
      await this.props.deleteDeal(this.props.deal.id)

      this.props.notify({
        message: 'The deal has deleted.',
        status: 'success'
      })
    } catch (e) {
      return false
    }

    this.setState({
      isDeleting: false
    })
  }

  render() {
    if (this.props.deal.deleted_at !== null) {
      return false
    }

    return (
      <ActionButton
        style={{
          width: '100%',
          justifyContent: 'center',
          ...this.props.style
        }}
        disabled={this.state.isDeleting}
        appearance="outline"
        onClick={this.handleClick}
      >
        Delete Deal
      </ActionButton>
    )
  }
}

DeleteDeal.propTypes = {
  style: PropTypes.object,
  deal: PropTypes.object.isRequired,
  isBackOffice: PropTypes.bool.isRequired
}

DeleteDeal.defaultProps = {
  style: {}
}

function mapStateToProps({ deals, user }, props) {
  return {
    user,
    checklists: getDealChecklists(props.deal, deals.checklists)
  }
}

export default connect(
  mapStateToProps,
  { confirmation, deleteDeal, notify }
)(DeleteDeal)
