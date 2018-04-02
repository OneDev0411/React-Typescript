import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import cn from 'classnames'
import Deal from '../../../../../../models/Deal'
import DealContext from '../../../../../../models/DealContext'
import { getStatusColorClass } from '../../../../../../utils/listing'
import StatusModal from './listing-status-modal'
import Message from '../../../Chatroom/Util/message'
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

    if (isBackOffice) {
      await updateContext(deal.id, {
        listing_status: {
          value: status,
          approved: true
        }
      })
    } else {
      await this.notifyAdmin(status)
    }

    // set state
    this.setState({ saving: null })
  }

  async notifyAdmin(status) {
    const {
      deal,
      user,
      checklists,
      notify,
      changeNeedsAttention,
      createGenericTask
    } = this.props

    const title = `Change listing status to ${status}`

    const activeOfferChecklistId = deal.checklists.find(
      id =>
        !checklists[id].is_deactivated &&
        !checklists[id].is_terminated &&
        checklists[id].checklist_type === 'Buying'
    )

    const task = await createGenericTask(deal.id, title, activeOfferChecklistId)

    const message = {
      comment: `Hello, Please change listing status to ${status}`,
      author: user.id,
      room: task.room.id
    }

    // send comment message
    Message.postTaskComment(task, message)

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

    return (
      <Fragment>
        <div className={cn('item', { disabled: !isBackOffice })}>
          <StatusModal
            deal={deal}
            show={showModal}
            status={status}
            isBackOffice={isBackOffice}
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

            <span>{status}</span>

            {isBackOffice &&
              !saving && (
                <button
                  className="deals-info__mls-status__edit-cta c-button--shadow"
                  onClick={() => this.toggleModal()}
                >
                  EDIT
                </button>
              )}
          </div>

          {saving && (
            <i
              style={{ marginLeft: '5px' }}
              className="fa fa-spin fa-spinner"
            />
          )}
        </div>

        {!isBackOffice &&
          DealContext.getHasActiveOffer(deal) && (
            <div>
              <button
                onClick={() => this.toggleModal()}
                className="btn-change-status"
              >
                Change Status
              </button>
            </div>
          )}
      </Fragment>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    user,
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
