import React from 'react'
import { browserHistory } from 'react-router'
import { Button, Popover, OverlayTrigger } from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'
import CriticalDates from '../dashboard/factsheet/critical-dates'
import Deal from '../../../../../models/Deal'

const SORT_ADDRESS = 'address'
const SORT_STATUS = 'status'
const SORT_PRICE = 'price'
const SORT_SIDE = 'side'

_.mixin({
  shouldReverse: function(obj, order) {
    return order === 'asc' ? obj.reverse() : obj
  }
})

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
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

  render() {
    const { deals } = this.props
    const { searchFilter, sortBy, sortOrder } = this.state

    return (
      <div className="deals-list">

        <div className="heading">
          <input
            onChange={e => this.setState({ searchFilter: e.target.value })}
            className="search"
            type="text"
            placeholder="Type in to search ..."
          />

          <Button
            bsStyle="primary"
            onClick={() => this.create('listing')}
          >
            New Listing
          </Button>

          <Button
            bsStyle="primary"
            onClick={() => this.create('offer')}
          >
            Make an Offer
          </Button>
        </div>

        <div className="table-container">
          <table className="table table-hover">
            <tbody>
              <tr className="header">

                <td
                  className={ cn('sortable', { isActive: sortBy === SORT_ADDRESS}) }
                  onClick={() => this.setSort(SORT_ADDRESS)}
                >
                  { this.getSorterCaret(SORT_ADDRESS) }
                  ADDRESS
                </td>

                <td
                  className={ cn('sortable', { isActive: sortBy === SORT_STATUS}) }
                  onClick={() => this.setSort(SORT_STATUS)}
                >
                  { this.getSorterCaret(SORT_STATUS) }
                  STATUS
                </td>

                <td
                  className={ cn('sortable', { isActive: sortBy === SORT_PRICE}) }
                  onClick={() => this.setSort(SORT_PRICE)}
                >
                  { this.getSorterCaret(SORT_PRICE) }
                  PRICE
                </td>

                <td
                  className={ cn('sortable', { isActive: sortBy === SORT_SIDE}) }
                  onClick={() => this.setSort(SORT_SIDE)}
                >
                  { this.getSorterCaret(SORT_SIDE) }
                  SIDE
                </td>

                <td>NEXT DATES</td>
                <td>OUTSTANDING</td>
              </tr>

              {
                _.chain(deals)
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
                    <td className="address">
                      <img src={this.getListingPhoto(deal)} />
                      {this.getAddress(deal)}
                    </td>
                    <td>{this.getStatus(deal)}</td>
                    <td>{this.getFormattedNumber(this.getPrice(deal))}</td>
                    <td>{this.getSide(deal)}</td>
                    <td>
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
                        <span>[HOVER ME]</span>
                      </OverlayTrigger>
                    </td>

                    <td>0</td>
                    <td></td>
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
