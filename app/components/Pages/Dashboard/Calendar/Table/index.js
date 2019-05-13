import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'
import ScrollDetector from 'react-scroll-detector'
import moment from 'moment'
import _ from 'underscore'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { primary } from 'views/utils/colors'
import Grid from 'views/components/Grid/Table'
import { grey } from 'views/utils/colors'

import { goTo } from 'utils/go-to'

import { getSelectedDate } from 'reducers/calendar'
import { setDate } from 'actions/calendar'

import { GridContainer, TableHeader, Label, Indicator, Title } from './styled'
import EmptyState from './EmptyState'
import Fetching from './Fetching'
import EventIcon from './EventIcon'

export class Table extends React.Component {
  constructor(props) {
    super(props)

    this.onHoverDate = _.debounce(this.onHoverDate, 300)
  }

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

  eventTime = rowData => {
    if (rowData.object_type !== 'crm_task') {
      return 'All day'
    }

    return moment.unix(rowData.timestamp).format('hh:mm A')
  }

  getEventActions = row => {
    if (row.event_type === 'birthday') {
      return (
        <SendContactCard
          contactId={row.contact}
          buttonStyle={{
            size: 'small'
          }}
        >
          Send a Card
        </SendContactCard>
      )
    }
  }

  get Columns() {
    return [
      {
        id: 'type',
        isSortable: false,
        render: ({ rowData }) => (
          <Flex style={{ padding: '4px 1rem' }}>
            <EventIcon event={rowData} />

            <div>
              <Title onClick={() => this.onTitleClick(rowData)}>
                {rowData.title}
              </Title>

              <Flex>
                {this.eventTime(rowData)}
                <Indicator> | </Indicator>
                <Label>{rowData.type_label}</Label>
              </Flex>
            </div>
          </Flex>
        )
      },
      {
        id: 'action',
        isSortable: false,
        width: '20%',
        render: ({ rowData }) => this.getEventActions(rowData)
      }
    ]
  }

  onTitleClick = row => {
    switch (row.object_type) {
      case 'deal_context':
        goTo(`/dashboard/deals/${row.deal}`, 'Calendar')
        break

      case 'contact_attribute':
        goTo(`/dashboard/contacts/${row.contact}`, 'Calendar')
        break

      case 'crm_task':
        this.props.onSelectTask({ id: row.id, type: row.event_type })
        break
    }
  }

  onHoverDate = value => {
    this.props.setDate(new Date(value))
  }

  getGridHeaderProps = () => ({
    style: {
      display: 'none'
    }
  })

  getGridHeaderRowProps = () => ({
    style: {
      marginBottom: 0
    }
  })

  getSubTableProps = group => ({
    onMouseMove: () => this.onHoverDate(group.date)
  })

  getGridTrProps = (rowIndex, { original: row }) => {
    const props = {}

    if (row.object_type === 'crm_task' && row.status === 'DONE') {
      props.style = { opacity: 0.5 }
    }

    return {
      ...props,
      hoverStyle: `
        background-color: ${grey.A000};
        a {
          color: ${primary}
        }
      `,
      style: {
        ...props.style
      }
    }
  }

  getGridTdProps = (colIndex, { column }) => {
    if (column.id === 'action') {
      return {
        style: { alignSelf: 'center', textAlign: 'right', paddingRight: '1rem' }
      }
    }

    return {}
  }

  render() {
    const {
      isFetching,
      loadingPosition,
      positions,
      onScrollTop,
      onScrollBottom,
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
        <GridContainer isFilterHidden={this.props.isFilterHidden}>
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
            EmptyState={EmptyState}
            onTableRef={onRef}
            getSubTableProps={this.getSubTableProps}
            getTrProps={this.getGridTrProps}
            getTdProps={this.getGridTdProps}
            getHeaderProps={this.getGridHeaderProps}
            getHeaderRowProps={this.getGridHeaderRowProps}
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
    selectedDate: getSelectedDate(calendar),
    calendar: calendar.list,
    calendarDays: calendar.byDay
  }
}

export default connect(
  mapStateToProps,
  { setDate }
)(Table)
