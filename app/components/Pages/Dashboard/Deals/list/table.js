import React from 'react'
import cn from 'classnames'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import _ from 'underscore'
import { getStatusColorClass } from '../../../../../utils/listing'
import Deal from '../../../../../models/Deal'
import DealContext from '../../../../../models/DealContext'
import CriticalDates from '../dashboard/factsheet/critical-dates'
import EmptyState from './empty-state'
import ToolTip from '../components/tooltip'
import OpenDeal from '../utils/open-deal'
import NoSearchResults from './no-search-results'
import EmptySearch from './empty-search'

/*
 * implement a new functionality for underscore that checks
 * whether a list should update or not
 */
_.mixin({
  shouldReverse(obj, order) {
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
  getListingPhoto(deal) {
    const photo = Deal.get.field(deal, 'photo')
    return photo || '/static/images/deals/home.png'
  }

  /**
   *
   */
  getAddress(deal) {
    const address = Deal.get.address(deal, this.props.roles)

    return (
      <div className="address-row">
        <img src={this.getListingPhoto(deal)} />
        <div className="name">{address}</div>
      </div>
    )
  }

  getStatus(deal) {
    const status = Deal.get.status(deal)

    return (
      <div>
        <span
          className="status-bullet"
          style={{ background: getStatusColorClass(status) }}
        />
        {status}
      </div>
    )
  }

  getNextDate(deal, rowId, rowsCount) {
    const table = DealContext.getFactsheetSection(deal, 'CriticalDates')

    if (table.length === 0) {
      return <span></span>
    }

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
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
          {CriticalDates.getNextDate(deal)}
        </span>
      </OverlayTrigger>
    )
  }

  /**
   *
   */
  setSort(field) {
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
    const { sortBy } = this.state

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
    }

    return object.toString()
      .toLowerCase()
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
        return filters[f](deal)
      }

      if (!cells[f]) {
        return matched
      }

      const value = cells[f].getValue(deal)
      const criteria = _.find(filters, (value, name) => name.includes(f))

      if (_.isFunction(criteria)) {
        matched = criteria(value, deal)
      } else if (_.isBoolean(criteria)) {
        matched = value
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

    OpenDeal(id)
  }

  /**
   *
   */
  hasNotification(deal) {
    if (deal.new_notifications > 0) {
      return (
        <ToolTip caption={`You have ${deal.new_notifications} unread messages in this deal`}>
          <div className="inline unread-notifications">
            <img src="/static/images/deals/comments.svg" />
            <span>{deal.new_notifications}</span>
          </div>
        </ToolTip>
      )
    }
  }

  render() {
    const {
      deals,
      isBackOffice,
      searchBoxIsOpen,
      emptySearchPageIsOpen,
      loadingDeals
    } = this.props
    const { sortBy, sortOrder } = this.state

    // apply filter to deals
    const filteredDeals = _.filter(deals, deal => this.applyFilters(deal))

    let hasRows = true

    if (searchBoxIsOpen && emptySearchPageIsOpen) {
      return (
        <div className="table-container">
          <EmptySearch />
        </div>
      )
    }

    if ((isBackOffice && filteredDeals.length === 0) ||
      (!isBackOffice && _.size(deals) === 0)
    ) {
      if (searchBoxIsOpen) {
        return (
          <div className="table-container">
            <NoSearchResults />
          </div>
        )
      }

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
                    _.chain(this.cells)
                      .filter(cell => !cell.justFilter)
                      .map((cell, key) =>
                        <td
                          key={`CELL_${key}`}
                          className={cn(cell.className, {
                        sortable: cell.sortable,
                        isActive: sortBy === key
                      })}
                        >
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => cell.sortable && this.setSort(key)}
                          >
                            {cell.caption}&nbsp;
                            {cell.sortable && this.getSorterCaret(key)}
                          </span>
                        </td>)
                    .value()
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
                        _.chain(this.cells)
                          .filter(cell => !cell.justFilter)
                          .map((cell, key) => (
                            <td
                              key={`DEAL_${deal.id}__CELL_${key}`}
                              className={cell.className}
                            >
                              {cell.getText(deal, rowId, filteredDeals.length)}
                            </td>
                          ))
                          .value()
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
