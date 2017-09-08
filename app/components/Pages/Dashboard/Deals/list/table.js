import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { browserHistory } from 'react-router'
import { Row, Col, Popover, OverlayTrigger } from 'react-bootstrap'
import _ from 'underscore'
import { getStatusColorClass } from '../../../../../utils/listing'
import Deal from '../../../../../models/Deal'
import DealCreate from '../create'
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
    return photo ? photo : '/static/images/deals/home.svg'
  }

  /**
   *
   */
  getAddress(deal) {
    const address = Deal.get.field(deal, 'full_address')

    return (
      <Row>
        <Col md={2} sm={3} xs={2} className="vcenter">
          <img src={this.getListingPhoto(deal)} />
        </Col>
        <Col md={10} sm={9} xs={10} className="vcenter">
          <div className="name">{ address }</div>
        </Col>
      </Row>
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
        matched = criteria(value)
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

    browserHistory.push(`/dashboard/deal/${id}`)
  }

  /**
   *
   */
  hasNotification(deal) {
    let counter = 0

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
        const room = this.props.rooms[task.room.id] || task.room

        if (room.new_notifications > 0) {
          counter += room.new_notifications
        }
      })
    })

    if (counter > 0) {
      return <span
        style={{
          display: 'block',
          width: '10px',
          height: '10px',
          borderRadius: '20px',
          backgroundColor: '#2196f3'
        }}
      />
    }
  }

  render() {
    const { deals } = this.props
    const { sortBy, sortOrder } = this.state

    return (
      <div className="table-container">
        {
          _.size(deals) > 0 ?
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
          </table> :

          <div className="list-empty">
            <div className="title">You don’t have any deals yet</div>
            <div className="descr">Get started by creating a new listing or making an offer.</div>

            <div className="inline">
              <DealCreate type="listing" />
              <DealCreate type="offer" />
            </div>
          </div>
        }

      </div>
    )
  }
}

export default BaseTable
