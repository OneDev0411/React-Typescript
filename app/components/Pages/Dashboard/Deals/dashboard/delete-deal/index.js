import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { browserHistory } from 'react-router'
import { Button } from 'react-bootstrap'
import { confirmation } from '../../../../../../store_actions/confirmation'
import { deleteDeal } from '../../../../../../store_actions/deals'

class DeleteDeal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleting: false
    }
  }

  requestDelete() {
    const { confirmation } = this.props

    confirmation({
      message: 'Delete this deal?',
      confirmLabel: 'Yes, delete deal',
      onConfirm: () => this.delete()
    })
  }

  async delete() {
    const { notify, deal, deleteDeal } = this.props

    this.setState({
      deleting: true
    })

    try {
      // delete deal
      await deleteDeal(deal.id)

      // show notifications
      notify({
        message: 'Deal has been deleted',
        status: 'success'
      })

      // go back
      browserHistory.push('/dashboard/deals')
    } catch(e) {
      console.log(e)
      notify({
        message: 'Can not delete deal. try again.',
        status: 'error'
      })
    }
  }

  render() {
    const { deleting } = this.state

    return (
      <Button
        className="info-btn delete-deal-button"
        onClick={() => this.requestDelete()}
        disabled={deleting}
      >
        { deleting ? 'Deleting ...' : 'Delete deal' }
      </Button>
    )
  }
}

export default connect(null, { confirmation, deleteDeal, notify })(DeleteDeal)
