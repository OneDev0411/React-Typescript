import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { browserHistory } from 'react-router'
import { Button } from 'react-bootstrap'
import { confirmation } from '../../../../../../store_actions/confirmation'
import {
  archiveDeal,
  createGenericTask,
  changeNeedsAttention
} from '../../../../../../store_actions/deals'

class ArchiveDeal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      archiving: false
    }
  }

  requestArchive() {
    const { isBackOffice, confirmation } = this.props

    confirmation({
      message: isBackOffice ? 'Archive this deal?' : 'Notify admin to archive this deal?',
      confirmLabel: 'Yes',
      onConfirm: () => this.archive()
    })
  }

  async archive() {
    const {
      notify,
      deal,
      checklists,
      archiveDeal,
      isBackOffice,
      createGenericTask,
      changeNeedsAttention
    } = this.props

    this.setState({ archiving: true })

    if (!isBackOffice) {
      let title = 'Please archive this deal for me.'
      let checklist = checklists[deal.checklists[0]]

      // create generic task
      const task = await createGenericTask(deal.id, title, checklist.id)
      // set needs attention
      changeNeedsAttention(task.id, true)
      // set status
      this.setState({ archiving: false })

      return notify({
        message: 'Back office has been notified to archive this deal',
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })
    }

    try {
      // archive deal
      await archiveDeal(deal.id)

      // show notifications
      notify({
        message: 'Deal has been archived',
        status: 'success'
      })

      // go back
      browserHistory.push('/dashboard/deals')
    } catch(e) {
      notify({
        message: 'Can not archive deal. try again.',
        status: 'error'
      })
    }
  }

  render() {
    const { archiving } = this.state

    return (
      <Button
        className="info-btn archive-deal-button"
        onClick={() => this.requestArchive()}
        disabled={archiving}
      >
        { archiving ? 'Working ...' : 'Archive deal' }
      </Button>
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice,
  checklists: deals.checklists
}), {
  confirmation,
  archiveDeal,
  createGenericTask,
  changeNeedsAttention,
  notify
})(ArchiveDeal)
