import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import ScrollDetector from 'react-scroll-detector'
import moment from 'moment'

import Grid from '../../../../../views/components/Grid/Table'
import { GridContainer, TableHeader } from './styled'
import EmptyState from './EmptyState'
import Fetching from './Fetching'

export class Table extends React.Component {
  getDayHeader = date => moment(date).format('dddd, MMM DD, YYYY')

  isSelectedDay = date =>
    moment(this.props.selectedDate).format('YYYY-MM-DD') ===
    moment(date).format('YYYY-MM-DD')

  get Data() {
    const { calendar, calendarDays: days } = this.props
    const table = []

    _.each(days, (list, date) => {
      if (list.length === 0) {
        return table.push({
          key: date,
          refId: date,
          date,
          data: []
        })
      }

      return table.push({
        key: date,
        refId: date,
        date,
        data: list.map(id => ({
          ...calendar[id]
        }))
      })
    })

    return table
  }

  get Columns() {
    return [
      {
        id: 'type',
        header: 'Type',
        width: '20%',
        render: ({ rowData }) => <Fragment>{rowData.type_label}</Fragment>
      },
      {
        id: 'name',
        header: 'Name',
        width: '30%',
        render: ({ rowData }) => rowData.title
      },
      {
        id: 'time',
        header: 'Time',
        render: ({ rowData }) =>
          moment.unix(rowData.timestamp).format('hh:mm A')
      },
      {
        id: 'menu',
        header: '',
        width: '10%'
      }
    ]
  }

  render() {
    const {
      isFetching,
      loadingPosition,
      positions,
      onScrollTop,
      onScrollBottom,
      getTrProps,
      onRef
    } = this.props

    const data = this.Data
    const columns = this.Columns

    return (
      <ScrollDetector
        onScrollTop={onScrollTop}
        onScrollBottom={onScrollBottom}
        accuracy={60}
        debounceTime={50}
      >
        <GridContainer>
          <Fetching
            show={
              isFetching && loadingPosition === positions.Top && data.length > 0
            }
            absolute={false}
          />

          <Fetching
            absolute
            show={isFetching && loadingPosition === positions.Middle}
          />

          <Grid
            columns={columns}
            data={data}
            emptyState={<EmptyState />}
            onTableRef={onRef}
            getTrProps={getTrProps}
            SubComponent={({ date }) => (
              <TableHeader isSelectedDay={this.isSelectedDay(date)}>
                {this.getDayHeader(date)}
              </TableHeader>
            )}
            multiple
          />

          <Fetching
            show={
              isFetching &&
              loadingPosition === positions.Bottom &&
              data.length > 0
            }
            absolute={false}
          />
        </GridContainer>
      </ScrollDetector>
    )
  }
}

function mapStateToProps({ calendar }) {
  return {
    selectedDate: new Date(calendar.selectedDate),
    calendar: calendar.list,
    calendarDays: calendar.byDay
  }
}

export default connect(mapStateToProps)(Table)
