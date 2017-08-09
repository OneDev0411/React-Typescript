import React from 'react'
import { browserHistory } from 'react-router'
import {
  Row,
  Col,
  Tooltip,
  Button,
  Popover,
  OverlayTrigger,
  DropdownButton,
  Dropdown,
  MenuItem
} from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'
import CriticalDates from '../dashboard/factsheet/critical-dates'
import Deal from '../../../../../models/Deal'
import DealCreate from '../create'
import { getStatusColorClass } from '../../../../../utils/listing'

const SORT_ADDRESS = 'address'
const SORT_STATUS = 'status'
const SORT_PRICE = 'price'
const SORT_SIDE = 'side'

const FILTER_ACTIVE = ['Active']
const FILTER_PENDING = [
  'Active Contingent',
  'Active Kick out',
  'Active Option Contract',
  'Pending'
]
const FILTER_ARCHIVE = [
  'Sold',
  'Temp Off Market',
  'Expired',
  'Cancelled',
  'Withdrawn'
]

const filters = {
  All: () => true,
  Active: status => FILTER_ACTIVE.indexOf(status) > -1,
  Pending: status => FILTER_PENDING.indexOf(status) > -1,
  Archive: status => FILTER_ARCHIVE.indexOf(status) > -1
}

/*
 * implement a new functionality for underscore that checks
 * whether a list should update or not
 */
_.mixin({
  shouldReverse: function(obj, order) {
    return order === 'asc' ? obj.reverse() : obj
  }
})

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filterTab: 'All',
      searchFilter: '',
      sortBy: null,
      sortOrder: 'asc'
    }
  }

  /**
   *
   */
  onClickDeal(e, id) {
    if (e.target.type === 'checkbox')
      return false

    browserHistory.push(`/dashboard/deal/${id}`)
  }

  /**
   *
   */
  create(type) {
    browserHistory.push(`/dashboard/deal/create/${type}`)
  }

  /**
   *
   */
  getListingPhoto(deal) {
    const photo = Deal.get.field(deal, 'photo')
    return photo ? photo : '/static/images/deals/home.svg'
  }

  /**
   *
   */
  getAddress(deal) {
    return Deal.get.address(deal)
  }

  /**
   *
   */
  getPrice(deal) {
    return Deal.get.field(deal, 'list_price')
  }

  /**
   *
   */
  getFormattedNumber(number) {
    if (!number) {
      return number
    }

    return number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  /**
   *
   */
  getStatus(deal) {
    return Deal.get.field(deal, 'listing_status')
  }

  /**
   *
   */
  getSide(deal) {
    return Deal.get.field(deal, 'deal_type')
  }

  /**
   *
   */
  setSort(field, order = 'ASC', sorter = []) {
    const { sortBy, sortOrder } = this.state

    this.setState({
      sortBy: field,
      sortOrder: (sortOrder === 'asc' && field === sortBy) ? 'desc' : 'asc'
    })
  }

  /**
   *
   */
  sort(deal) {
    const { sortBy, sortOrder } = this.state

    if (!sortBy) {
      return true
    }

    // sort functions map
    const sortFunc = {
      price: this.getPrice,
      status: this.getStatus,
      address: this.getAddress,
      side: this.getSide
    }

    // default is sort by value
    let sortByList = false

    // status should sort by a specific list
    if (sortBy === 'status') {
      sortByList = ['Incoming', 'Coming Soon', 'Active', 'Active Option Contract',
      'Active Contingent', 'Active Kick Out', 'Pending', 'Sold', 'Leased', 'Expired',
      'Temp Off Market', 'Cancelled', 'Withdrawn']
    }

    // get field value
    const sortObject = sortFunc[sortBy](deal)

    if (sortByList === false) {
      return sortObject
    } else {
      const order = sortByList.indexOf(sortObject)
      return order > -1 ? order : sortByList.length + 1
    }
  }

  /**
   *
   */
  getSorterCaret(field) {
    const { sortOrder, sortBy } = this.state
    return <i
      className={
        cn('fa fa-caret-down', {
          'fa-rotate-180': field === sortBy && sortOrder === 'desc'
        })
      }
    />
  }

  /**
   * get role names of deal for side column
   */
  getRoleNames(deal) {
    const names = []

    deal.roles && deal.roles.forEach(role =>
      names.push(role.user.abbreviated_display_name)
    )

    return ': ' + names.join(', ')
  }

  /**
   * get next date of critical dates
   */
  getNextDate(deal) {
    return CriticalDates.getNextDate(deal)
  }

  /**
   * get filter tab tooltip
   */
  getFilterTabTooltip(tab) {
    let tooltip = []

    switch (tab) {
      case 'Pending':
        tooltip = FILTER_PENDING
        break
      case 'Archive':
        tooltip = FILTER_ARCHIVE
        break
      case 'Active':
        tooltip = FILTER_ACTIVE
        break
      default:
        tooltip = ['All']
    }

    return tooltip
      .join(', ')
      .replace(/,([^,]*)$/, ' and $1') + ' Listings'
  }

  render() {
    const { deals } = this.props
    const { searchFilter, sortBy, sortOrder, filterTab } = this.state

    return (
      <div className="deals-list">

        <Row className="heading">
          <Col lg={6} md={5} sm={6} xs={12}>
            <ul className="filter">
              {
                _.map(filters, (fn, filter) =>
                  <OverlayTrigger
                    key={`FILTER_${filter}`}
                    placement="bottom"
                    overlay={
                      <Tooltip id={`TOOLTIP_${filter}`}>
                        { this.getFilterTabTooltip(filter) }
                      </Tooltip>
                    }
                  >
                    <li
                      className={filter === filterTab ? 'active' : ''}
                      onClick={() => this.setState({ filterTab: filter })}
                    >
                      { filter }
                    </li>
                  </OverlayTrigger>
                )
              }
            </ul>
          </Col>

          <Col lg={6} md={7} sm={6} xs={12} className="text-right">
            <input
              onChange={e => this.setState({ searchFilter: e.target.value })}
              className="search"
              type="text"
              placeholder="Type in to search ..."
            />

            <DealCreate type="listing" />
            <DealCreate type="offer" />
          </Col>
        </Row>

        <div className="table-container">
          <table className="table table-hover">
            <tbody>
              <tr className="header">

                <td
                  className={ cn('col-md-3 sortable', { isActive: sortBy === SORT_ADDRESS}) }
                  onClick={() => this.setSort(SORT_ADDRESS)}
                >
                  { this.getSorterCaret(SORT_ADDRESS) }
                  ADDRESS
                </td>

                <td
                  className={ cn('col-md-2 sortable', { isActive: sortBy === SORT_STATUS}) }
                  onClick={() => this.setSort(SORT_STATUS)}
                >
                  { this.getSorterCaret(SORT_STATUS) }
                  STATUS
                </td>

                <td
                  className={ cn('col-md-1 sortable', { isActive: sortBy === SORT_PRICE}) }
                  onClick={() => this.setSort(SORT_PRICE)}
                >
                  { this.getSorterCaret(SORT_PRICE) }
                  PRICE $
                </td>

                <td
                  className={ cn('col-md-2 sortable', { isActive: sortBy === SORT_SIDE}) }
                  onClick={() => this.setSort(SORT_SIDE)}
                >
                  { this.getSorterCaret(SORT_SIDE) }
                  SIDE
                </td>

                <td className="col-md-2">NEXT DATES</td>
                <td className="col-md-1">OUTSTANDING</td>
                <td className="col-md-1"></td>
              </tr>

              {
                _.chain(deals)
                .filter(deal => {
                  let fn = filters[this.state.filterTab]
                  return fn(this.getStatus(deal))
                })
                .filter(deal => {
                  const address = Deal.get.address(deal) || ''
                  return address.toLowerCase().includes(searchFilter.toLowerCase())
                })
                .sortBy(deal => this.sort(deal))
                .shouldReverse(sortOrder)
                .map(deal => (
                  <tr
                    key={`deal_${deal.id}`}
                    className="item"
                    onClick={e => this.onClickDeal(e, deal.id)}
                  >
                    <td className="address col-md-3">
                      <img src={this.getListingPhoto(deal)} />
                      {this.getAddress(deal)}
                    </td>

                    <td className="col-md-2">
                      <span
                        className="status-bullet"
                        style={{ background: getStatusColorClass(this.getStatus(deal)) }}
                      />
                      {this.getStatus(deal)}
                    </td>

                    <td className="col-md-1">
                      {this.getFormattedNumber(this.getPrice(deal))}
                    </td>

                    <td className="col-md-2">
                      {this.getSide(deal)}
                      <span style={{ color: '#9b9b9b' }}>
                        { this.getRoleNames(deal) }
                      </span>
                    </td>

                    <td className="col-md-2">
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="bottom"
                        overlay={
                          <Popover
                            className="deal-list--popover"
                            id={`popover-trigger-factsheet-${deal.id}`}
                          >
                            <CriticalDates deal={deal} />
                          </Popover>
                        }
                      >
                        <span>{ this.getNextDate(deal) }</span>
                      </OverlayTrigger>
                    </td>

                    <td className="col-md-1">0</td>
                    <td className="col-md-1"></td>
                  </tr>
                ))
                .reverse(sortOrder === 'desc')
                .value()
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
