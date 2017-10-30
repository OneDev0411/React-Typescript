import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import Deal from '../../../../../../models/Deal'
import { getStatusColorClass } from '../../../../../../utils/listing'
import StatusModal from './listing-status-modal'
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
    const editable = isBackOffice === true

    // set state
    this.setState({ saving: true })

    await updateContext(deal.id, {'listing_status': status}, editable)

    if (editable === false) {
      await this.notifyAdmin()
    }

    // set state
    this.setState({ saving: null })
  }

  async notifyAdmin(status) {
    const { deal, checklists, notify, changeNeedsAttention, createGenericTask } = this.props

    const title = `Change listing status to ${status}`

    const checklist = checklists[deal.checklists[0]]
    const task = await createGenericTask(deal.id, title, checklist.id)
    changeNeedsAttention(task.id, true)

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
    const status = statusContext.text
    const approved = statusContext.approved_at !== null

    return (
      <div className="item">
        <StatusModal
          deal={deal}
          show={showModal}
          status={status}
          saveText={isBackOffice ? 'Update' : 'Notify Admin'}
          onChangeStatus={(status) => this.onChangeStatus(status)}
          onClose={() => this.toggleModal()}
        />

        <div className="lbl">Status:</div>
        <div className="value mls-status">
          <span
            className="status"
            style={{ background: getStatusColorClass(status) }}
          />
          <span
            data-tip={approved ? null : 'Waiting for office approval'}
          >
            { status }
          </span>

          {
            !saving &&
            <i
              className="fa fa-pencil"
              onClick={() => this.toggleModal()}
            />
          }
        </div>

        {
          saving &&
          <i
            style={{ marginLeft: '5px' }}
            className="fa fa-spin fa-spinner"
          />
        }
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice,
  checklists: deals.checklists
}), { notify, updateContext, createGenericTask, changeNeedsAttention })(ListingStatus)
