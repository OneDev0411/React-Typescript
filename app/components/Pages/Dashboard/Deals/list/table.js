import React from 'react'
import cn from 'classnames'
import { browserHistory } from 'react-router'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import _ from 'underscore'
import { getStatusColorClass } from '../../../../../utils/listing'
import Deal from '../../../../../models/Deal'
import CriticalDates from '../dashboard/factsheet/critical-dates'


/*
 * implement a new functionality for underscore that checks
 * whether a list should update or not
 */
_.mixin({
  shouldReverse: function(obj, order) {
    return order === 'desc' ? obj.reverse() : obj
  }
})

export default class BaseTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      sortBy: null,
      sortOrder: 'asc'
    }
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
  getListingPhoto(deal) {
    const photo = Deal.get.field(deal, 'photo')
    return photo ? photo : '/static/images/deals/home.svg'
  }

  /**
   *
   */
  getAddress(deal) {
    const address = Deal.get.address(deal)

    return (
      <div>
        <img src={this.getListingPhoto(deal)} />
        { address }
      </div>
    )
  }

  getStatus(deal) {
    const status = Deal.get.field(deal, 'listing_status')

    return (
      <div>
        <span
          className="status-bullet"
          style={{ background: getStatusColorClass(status) }}
        />
        { status }
      </div>
    )
  }

  getNextDate(deal) {
    return (
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
        <span>{ CriticalDates.getNextDate(deal) }</span>
      </OverlayTrigger>
    )
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

    // get field value
    const cell = this.cells[sortBy]
    const object = (cell.getValue || cell.getText)(deal)

    if (cell.sortByList) {
      const order = cell.sortByList.indexOf(object)
      return order > -1 ? order : cell.sortByList.length + 1
    } else {
      return object
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
   *
   */
  applyFilters(deal) {
    const { filters } = this.props
    const { cells } = this

    if (_.size(filters) === 0) {
      return true
    }

    for (let filter in filters) {
      if (!cells[filter]) {
        continue
      }

      const value = cells[filter].getValue(deal)
      const criteria = filters[filter]

      let matched = true

      if (_.isFunction(criteria)) {
        matched = criteria(value)
      } else if (criteria.length > 0) {
        matched = value.toLowerCase().includes(criteria.toLowerCase())
      }

      if (!matched) {
        return false
      }
    }

    return true
  }

  /**
   *
   */
  onClickDeal(e, id) {
    if (e.target.type === 'checkbox') {
      return false
    }

    browserHistory.push(`/dashboard/deal/${id}`)
  }

  render() {
    const { deals } = this.props
    const { sortBy, sortOrder } = this.state

    return (
      <div className="table-container">
        <table className="table table-hover">
          <tbody>
            <tr className="header">
              {
                _.map(this.cells, (cell, key) =>
                  <td
                    key={`CELL_${key}`}
                    className={cn(cell.className, {
                      sortable: cell.sortable,
                      isActive: sortBy === key
                    })}
                    onClick={() => {
                      if (cell.sortable) {
                        this.setSort(key)
                      }
                    }}
                  >
                    { cell.caption }&nbsp;

                    {
                      cell.sortable &&
                      this.getSorterCaret(key)
                    }
                  </td>
                )
              }
            </tr>

            {
              _.chain(deals)
              .filter(deal => this.applyFilters(deal))
              .sortBy(deal => this.sort(deal))
              .shouldReverse(sortOrder)
              .map(deal => (
                <tr
                  key={`DEAL_${deal.id}`}
                  className="item"
                  onClick={e => this.onClickDeal(e, deal.id)}
                >
                  {
                    _.map(this.cells, (cell, key) =>
                      <td
                        key={`DEAL_${deal.id}__CELL_${key}`}
                        className={cell.className}
                      >
                        { cell.getText(deal) }
                      </td>
                    )
                  }
                </tr>
              ))
              .value()
            }
          </tbody>
        </table>
      </div>
    )
  }
}
