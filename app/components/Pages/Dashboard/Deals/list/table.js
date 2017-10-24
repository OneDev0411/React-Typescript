import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { browserHistory } from 'react-router'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import _ from 'underscore'
import { getStatusColorClass } from '../../../../../utils/listing'
import Deal from '../../../../../models/Deal'
import CriticalDates from '../dashboard/factsheet/critical-dates'
import EmptyState from './empty-state'

/*
 * implement a new functionality for underscore that checks
 * whether a list should update or not
 */
_.mixin({
  shouldReverse: function(obj, order) {
    return order === 'desc' ? obj.reverse() : obj
  }
})

class BaseTable extends React.Component {
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
    return photo ? photo : '/static/images/deals/home.png'
  }

  /**
   *
   */
  getAddress(deal) {
    const address = Deal.get.address(deal)

    return (
      <div className="address-row">
        <img src={this.getListingPhoto(deal)} />
        <div className="name">{ address }</div>
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

  getNextDate(deal, rowId) {
    const { deals } = this.props
    const dealsCount = _.size(deals)

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement={rowId > 3 && rowId + 3 >= dealsCount ? 'top' : 'bottom'}
        overlay={
          <Popover
            className="deal-list--popover"
            id={`popover-trigger-factsheet-${deal.id}`}
          >
            <CriticalDates
              deal={deal}
              showTitle={false}
            />
          </Popover>
        }
      >
        <span className="hoverable">
          { CriticalDates.getNextDate(deal) }
          <i className="fa fa-caret-down" />
        </span>
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
    }

    if (!object) {
      return null
    } else if (typeof object === 'number') {
      return ~~object
    } else {
      return object.toString().toLowerCase()
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

    return _.every(filters, (value, name) => {
      const splitted = name.split('^')
      return this.isMatched(deal, splitted)
    })
  }

  isMatched(deal, filter) {
    const { cells } = this
    const { filters } = this.props

    return filter.some(f => {
      let matched = false

      // don't process filter that uses reserved words
      if (/__(.*)__/.test(f)) {
        return true
      }

      if (!cells[f]) {
        return matched
      }

      const value = cells[f].getValue(deal)
      const criteria = _.find(filters, (value, name) => name.includes(f))

      if (_.isFunction(criteria)) {
        matched = criteria(value, deal)
      } else if (criteria.length > 0) {
        matched = value.toLowerCase().includes(criteria.toLowerCase())
      } else {
        matched = true
      }

      return matched
    })
  }

  /**
   *
   */
  onClickDeal(e, id) {
    if (e.target.type === 'checkbox') {
      return false
    }

    browserHistory.push(`/dashboard/deals/${id}`)
  }

  /**
   *
   */
  hasNotification(deal) {
    let counter = 0
    const { rooms } = this.props

    if (!deal.checklists) {
      return ''
    }

    deal.checklists.forEach(id => {
      const checklist = this.props.checklists[id]
      if (!checklist.tasks || checklist.tasks.length === 0) {
        return false
      }

      checklist.tasks.forEach(task_id => {
        const task = this.props.tasks[task_id]
        const room = (rooms && rooms[task.room.id]) || task.room

        if (room.new_notifications > 0) {
          counter += room.new_notifications
        }
      })
    })

    if (counter > 0) {
      return (
        <div
          className="inline unread-notifications"
          data-tip={`You have ${counter} unread messages in this deal`}
        >
          <img src="/static/images/deals/comments.svg" />
          <span>{ counter }</span>
        </div>
      )
    }
  }

  render() {
    const { deals, isBackOffice } = this.props
    const { sortBy, sortOrder } = this.state

    // apply filter to deals
    const filteredDeals = _.filter(deals, deal => this.applyFilters(deal))

    let hasRows = true
    if ((isBackOffice && _.size(filteredDeals) === 0) ||
      (!isBackOffice && _.size(deals) === 0)
    ) {
      hasRows = false
    }

    return (
      <div className="table-container">
        {
          hasRows ?
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
                _.chain(filteredDeals)
                .sortBy(deal => this.sort(deal))
                .shouldReverse(sortOrder)
                .map((deal, rowId) => (
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
                          { cell.getText(deal, rowId) }
                        </td>
                      )
                    }
                  </tr>
                ))
                .value()
              }
            </tbody>
          </table> :
          <EmptyState
            isBackOffice={isBackOffice}
          />
        }

      </div>
    )
  }
}

export default BaseTable
