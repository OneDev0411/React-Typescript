import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col, OverlayTrigger, Popover } from 'react-bootstrap'
import merge from 'merge'
import BaseTable from './table'
import Deal from '../../../../../models/Deal'
import getNeedsAttentions from '../utils/needs-attention'
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
      needs_attention: {
        caption: 'NEEDS ATTENTION',
        className: 'col-md-2',
        sortable: true,
        getText: (deal, rowId, rowsCount) =>
          this.getNeedsAttentions(deal, rowId, rowsCount),
        getValue: deal => this.getNeedsAttentionCount(deal)
      },
      notificiation: {
        caption: '',
        className: 'col-md-1',
        getText: deal => this.hasNotification(deal)
      }
    }
  }

  /**
   * get office name
   */
  getOffice(deal) {
    return ''

    const brand = this.flattenBrand(deal.brand)

    return brand && brand.messages ? brand.messages.office_title : 'N/A'
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
      text += moment.unix(task.review.updated_at).format('MMMM DD, HH:mm')
    }

    return text
  }

  /**
   * render needs attentions ui
   */
  getNeedsAttentions(deal, rowId, rowsCount) {
    const { tasks } = this.props
    const items = this.getNeedsAttentionsItems(deal)

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
        overlay={
          <Popover
            className="deal-list--needs-attention--popover"
            id={`popover-trigger-na-${deal.id}`}
          >
            {
              items.map(task_id => {
                const task = tasks[task_id]

                return (
                  <Row
                    key={task.id}
                    className="item"
                  >
                    <Col xs={8}>
                      <div className="info">
                        <span className="info-title">
                          {task.title}
                        </span>
                        <span className="info-desc">
                          {this.getTaskReviewMessage(task)}
                        </span>
                      </div>
                    </Col>

                    <Col xs={4}>
                      <span className="bdg">NEEDS ATTENTION</span>
                    </Col>
                  </Row>
                )
              })
            }
          </Popover>
        }
      >
        <span className="hoverable">
          {items.length}
        </span>
      </OverlayTrigger>
    )
  }

  /**
   * get needs attentions count
   */
  getNeedsAttentionCount(deal) {
    return this.getNeedsAttentionsItems(deal).length
  }

  /**
   * get needs attentions items
   */
  getNeedsAttentionsItems(deal) {
    const { filters } = this.props
    const filterTab = filters.__inbox_name__

    return getNeedsAttentions(deal, filterTab)
  }

  /**
   *
   */
  flattenBrand(brand) {
    if (!brand) {
      return null
    }

    let new_brand = {
      ...brand
    }

    const brands = [new_brand]

    while (new_brand.parent) {
      brands.push(new_brand.parent)
      new_brand = new_brand.parent
    }

    brands.reverse()

    const merged = {}

    brands.forEach(brand_loop => {
      merge.recursive(merged, brand_loop)
    })

    return merged
  }
}

export default connect(({ deals, chatroom }) => ({
  tasks: deals.tasks,
  checklists: deals.checklists,
  rooms: chatroom.rooms
}), { closeEsignWizard, setSelectedTask })(BackOfficeTable)
