import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col, OverlayTrigger, Popover } from 'react-bootstrap'
import merge from 'merge'
import BaseTable from './table'
import Deal from '../../../../../models/Deal'
import {
  closeEsignWizard,
  setSelectedTask
} from '../../../../../store_actions/deals'

class BackOfficeTable extends BaseTable {
  constructor(props) {
    super(props)

    this.cells = {
      address: {
        caption: 'ADDRESS',
        sortable: true,
        className: 'address col-md-3',
        getText: deal => this.getAddress(deal),
        getValue: deal => Deal.get.address(deal)
      },
      status: {
        caption: 'STATUS',
        sortable: true,
        className: 'col-md-1 hidden-xs',
        getText: deal => this.getStatus(deal),
        getValue: deal => Deal.get.status(deal),
        sortByList: ['Incoming', 'Coming Soon', 'Active', 'Active Option Contract',
          'Active Contingent', 'Active Kick Out', 'Pending', 'Sold', 'Leased',
          'Expired', 'Temp Off Market', 'Cancelled', 'Withdrawn']
      },
      property_type: {
        caption: 'PROPERTY TYPE',
        sortable: true,
        className: 'col-md-2 hidden-xs',
        getText: deal => deal.property_type
      },
      agent_name: {
        caption: 'AGENT NAME',
        sortable: true,
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: deal => deal.created_by ? deal.created_by.display_name : '',
        getValue: deal => deal.created_by ? deal.created_by.display_name : ''
      },
      office: {
        caption: 'OFFICE',
        sortable: true,
        className: 'col-md-1 hidden-sm hidden-xs',
        getText: deal => this.getOffice(deal)
      },
      critical_dates: {
        caption: 'CRITICAL DATES',
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: deal => this.getNextDate(deal)
      },
      notificiation: {
        caption: '',
        className: 'col-md-1',
        getText: deal => this.hasNotification(deal)
      },
      searchResult: {
        caption: '',
        justFilter: true,
        getValue: deal => deal.searchResult
      }
    }
  }

  /**
   * get office name
   */
  getOffice(deal) {
    const brand = this.flattenBrand(deal.brand)
    return brand && brand.messages ? brand.messages.branch_title : 'N/A'
  }

  /**
   * get task review message
   */
  getTaskReviewMessage(task) {
    if (!task.review) {
      return ''
    }

    let text = 'Submitted '

    if (task.review.updated_by) {
      text += `By ${task.review.updated_by.display_name}, `
    }

    if (task.review.updated_at) {
      text += moment.unix(task.review.updated_at)
        .format('MMMM DD, HH:mm')
    }

    return text
  }

  /**
   *
   */
  flattenBrand(brand) {
    if (!brand) {
      return null
    }

    const brands = [brand]

    while (brand.parent) {
      brands.push(brand.parent)
      brand = brand.parent
    }

    brands.reverse()

    let merged = {}

    brands.forEach(brand_loop => {
      merge.recursive(merged, { ...brand_loop, parent: undefined })
    })

    return merged
  }
}

export default connect(({ deals, chatroom }) => ({
  tasks: deals.tasks,
  checklists: deals.checklists,
  roles: deals.roles,
  rooms: chatroom.rooms
}), { closeEsignWizard, setSelectedTask })(BackOfficeTable)
