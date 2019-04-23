import React from 'react'
import { connect } from 'react-redux'

import { getStatusColorClass } from 'utils/listing'
import { upsertContexts } from 'actions/deals'
import { getDealChecklists } from 'reducers/deals/checklists'
import { getActiveChecklist } from 'models/Deal/helpers/get-active-checklist'

import Deal from 'models/Deal'
import DealContext from 'models/Deal/helpers/dynamic-context'

import { BasicDropdown } from 'components/BasicDropdown'
import Spinner from 'components/Spinner'
import { Icon as ArrowIcon } from 'components/Dropdown'

import { getField } from 'models/Deal/helpers/context'

import { createAdminRequestTask } from '../../utils/create-request-task'

import { DropDownButton, StatusBullet, StatusOption } from './styled'

class DealStatus extends React.Component {
  state = {
    isSaving: false
  }

  get CanChangeStatus() {
    return this.props.deal.is_draft === false
  }

  get IsLease() {
    return this.props.deal.property_type.includes('Lease')
  }

  get ListingStatusList() {
    if (this.IsLease) {
      return this.props.isBackOffice
        ? ['Active', 'Temp Off Market', 'Leased']
        : ['Leased']
    }

    return this.props.isBackOffice
      ? [
          'Coming Soon',
          'Active',
          'Sold',
          'Pending',
          'Temp Off Market',
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Withdrawn',
          'Expired',
          'Cancelled'
        ]
      : ['Coming Soon', 'Active']
  }

  get ContractStatusList() {
    if (this.IsLease) {
      return this.props.isBackOffice
        ? ['Contract Terminated', 'Leased', 'Lease Contract']
        : ['Lease Contract']
    }

    return this.props.isBackOffice
      ? [
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Pending',
          'Sold',
          'Contract Terminated'
        ]
      : [
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Pending',
          'Sold'
        ]
  }

  getStatusList() {
    if (getField(this.props.deal, 'contract_status')) {
      return this.ContractStatusList
    }

    return this.ListingStatusList
  }

  get StatusOptions() {
    return this.getStatusList().map(statusName => ({
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
      await this.props.upsertContexts(this.props.deal.id, [
        DealContext.createUpsertObject(
          this.props.deal,
          DealContext.getStatusField(this.props.deal),
          status,
          true
        )
      ])
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
    const checklist = getActiveChecklist(this.props.deal, this.props.checklists)

    createAdminRequestTask({
      checklist,
      userId: this.props.user.id,
      dealId: this.props.deal.id,
      taskTitle: `Change listing status to ${status}`,
      taskComment: `Hello, Please change listing status to ${status}`,
      notifyMessage: 'Back office has been notified to change listing status'
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
        fullHeight
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

function mapStateToProps({ deals, user }, props) {
  return {
    user,
    checklists: getDealChecklists(props.deal, deals.checklists)
  }
}

export default connect(
  mapStateToProps,
  {
    upsertContexts
  }
)(DealStatus)
