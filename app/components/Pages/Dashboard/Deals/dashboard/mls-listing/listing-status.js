import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import Deal from '../../../../../../models/Deal'
import { getStatusColorClass } from '../../../../../../utils/listing'
import StatusModal from './listing-status-modal'
import ToolTip from '../../components/tooltip'
import {
  updateContext,
  createGenericTask,
  changeNeedsAttention
} from '../../../../../../store_actions/deals'

class ListingStatus extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      saving: false
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  onChangeStatus(status) {
    this.toggleModal()
    this.updateStatus(status)
  }

  async updateStatus(status) {
    const { deal, isBackOffice, updateContext } = this.props

    // set state
    this.setState({ saving: true })

    await updateContext(deal.id, {
      listing_status: {
        value: status,
        approved: isBackOffice
      }
    })

    if (!isBackOffice) {
      await this.notifyAdmin(status)
    }

    // set state
    this.setState({ saving: null })
  }

  async notifyAdmin(status) {
    const {
      deal,
      checklists,
      notify,
      changeNeedsAttention,
      createGenericTask
    } = this.props

    const title = `Change listing status to ${status}`

    const checklist = checklists[deal.checklists[0]]
    const task = await createGenericTask(deal.id, title, checklist.id)

    changeNeedsAttention(deal.id, task.id, true)

    return notify({
      message: 'Back office has been notified to change listing status',
      status: 'success',
      dismissible: true,
      dismissAfter: 4000
    })
  }

  render() {
    const { showModal, saving } = this.state
    const { deal, isBackOffice } = this.props
    const statusContext = Deal.get.context(deal, 'listing_status')

    if (!statusContext) {
      return false
    }

    const status = statusContext.text || statusContext
    const approved = statusContext.approved_at !== null

    return (
      <div>
        <div className="item">
          <StatusModal
            deal={deal}
            show={showModal}
            status={status}
            saveText={isBackOffice ? 'Update' : 'Notify Office'}
            onChangeStatus={status => this.onChangeStatus(status)}
            onClose={() => this.toggleModal()}
          />

          <div className="lbl">Status:</div>
          <div className="value mls-status">
            <span
              className="status"
              style={{ background: getStatusColorClass(status) }}
            />
            <ToolTip
              caption={
                !isBackOffice && !approved ? 'Waiting for office approval' : null
              }
            >
              <span>{status}</span>
            </ToolTip>

            {!saving && (
              <button
                className="deals-info__mls-status__edit-cta c-button--shadow"
                onClick={() => this.toggleModal()}
              >
                EDIT
              </button>
            )}
          </div>

          {saving && (
            <i style={{ marginLeft: '5px' }} className="fa fa-spin fa-spinner" />
          )}
        </div>

        {isBackOffice &&
          !approved &&
          !saving && (
            <div className="approve-row">
              <button
                className="btn-approve"
                onClick={() => this.updateStatus(status)}
              >
                Approve
              </button>
            </div>
          )}
      </div>
    )
  }
}

export default connect(
  ({ deals }) => ({
    isBackOffice: deals.backoffice,
    checklists: deals.checklists
  }),
  {
    notify,
    updateContext,
    createGenericTask,
    changeNeedsAttention
  }
)(ListingStatus)
