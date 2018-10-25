import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { BasicDropdown } from 'components/BasicDropdown'
import Spinner from 'components/Spinner'
import { Icon as ArrowIcon } from 'components/Dropdown'

import { getStatusColorClass } from 'utils/listing'

import Message from '../../../Chatroom/Util/message'
import {
  updateContext,
  createGenericTask,
  changeNeedsAttention
} from 'actions/deals'

import Deal from 'models/Deal'
import DealContext from 'models/DealContext'

import { DropDownButton, StatusBullet, StatusOption } from './styled'

class DealStatus extends React.Component {
  state = {
    isSaving: false
  }

  get CanChangeStatus() {
    if (
      this.props.isBackOffice ||
      DealContext.getHasActiveOffer(this.props.deal)
    ) {
      return true
    }

    return false
  }

  get StatusList() {
    const { deal, isBackOffice } = this.props
    const isLeaseDeal = deal.property_type.includes('Lease')

    if (isLeaseDeal) {
      return isBackOffice
        ? [
            'Active',
            'Temp Off Market',
            'Lease Contract',
            'Leased',
            'Withdrawn',
            'Expired',
            'Cancelled',
            'Contract Terminated'
          ]
        : ['Active', 'Leased', 'Lease Contract', 'Contract Terminated']
    }

    return isBackOffice
      ? [
          'Active',
          'Sold',
          'Pending',
          'Temp Off Market',
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Withdrawn',
          'Expired',
          'Cancelled',
          'Contract Terminated'
        ]
      : [
          'Active',
          'Pending',
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Contract Terminated'
        ]
  }

  get StatusOptions() {
    return this.StatusList.map(statusName => ({
      label: statusName,
      value: statusName
    }))
  }

  get CurrentStatus() {
    return Deal.get.status(this.props.deal)
  }

  /**
   * updates listing_status context
   * @param {Object} selectedItem the selected dropdown item
   */
  updateStatus = async selectedItem => {
    const { value: status } = selectedItem

    if (this.state.isSaving) {
      return false
    }

    // set state
    this.setState({ isSaving: true })

    if (this.props.isBackOffice) {
      await this.props.updateContext(this.props.deal.id, {
        listing_status: {
          value: status,
          approved: true
        }
      })
    } else {
      await this.notifyAdmin(status)
    }

    // set state
    this.setState({
      isSaving: null
    })
  }

  /**
   * creates a new generic task and sends a notification to admin
   * @param {String} status the new deal status
   */
  notifyAdmin = async status => {
    const title = `Change listing status to ${status}`

    const activeOfferChecklist = this.props.deal.checklists
      .map(id => this.props.checklists[id])
      .find(
        checklist =>
          checklist.is_deactivated === false &&
          checklist.is_terminated === false &&
          checklist.checklist_type === 'Buying'
      )

    if (!activeOfferChecklist) {
      return false
    }

    const task = await this.props.createGenericTask(
      this.props.deal.id,
      title,
      activeOfferChecklist.id
    )

    const message = {
      comment: `Hello, Please change listing status to ${status}`,
      author: this.props.user.id,
      room: task.room.id
    }

    // send comment message
    Message.postTaskComment(task, message)

    this.props.changeNeedsAttention(this.props.deal.id, task.id, true)

    return this.props.notify({
      message: 'Back office has been notified to change listing status',
      status: 'success',
      dismissible: true,
      dismissAfter: 4000
    })
  }

  render() {
    if (this.CanChangeStatus === false) {
      return false
    }

    const dealStatus = this.CurrentStatus

    return (
      <BasicDropdown
        fullWidth
        pullTo="right"
        style={this.props.style}
        buttonSize={this.props.buttonSize}
        items={this.StatusOptions}
        itemToString={item => item.label}
        onChange={this.updateStatus}
        buttonRenderer={buttonProps => (
          <DropDownButton {...buttonProps} appearance="outline" inverse>
            {this.state.isSaving ? (
              <Spinner size="small" />
            ) : (
              <StatusBullet
                style={{
                  backgroundColor: getStatusColorClass(dealStatus)
                }}
              />
            )}

            {dealStatus}
            <ArrowIcon isOpen={buttonProps.isOpen} />
          </DropDownButton>
        )}
        itemRenderer={({ item, ...itemProps }) => {
          const isSelected = dealStatus === item.value

          return (
            <StatusOption
              {...itemProps}
              key={item.value}
              isDisabled={isSelected}
              isSelected={isSelected}
            >
              <StatusBullet
                style={{
                  backgroundColor: getStatusColorClass(item.value)
                }}
              />
              {item.label}
            </StatusOption>
          )
        }}
      />
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    user,
    checklists: deals.checklists
  }),
  {
    notify,
    updateContext,
    createGenericTask,
    changeNeedsAttention
  }
)(DealStatus)
