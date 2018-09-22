import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import ScrollDetector from 'react-scroll-detector'
import moment from 'moment'
import _ from 'underscore'

import { goTo } from '../../../../../utils/go-to'
import Grid from '../../../../../views/components/Grid/Table'
import { GridContainer, TableHeader, Label, Indicator, Title } from './styled'
import EmptyState from './EmptyState'
import Fetching from './Fetching'

import EventIcon from './EventIcon'
import { primary } from 'views/utils/colors'

import SendBirthdayCard from 'components/InstantMarketing/Flows/SendBirthdayCard'

export class Table extends React.Component {
  constructor(props) {
    super(props)

    this.getGridTrProps = this.getGridTrProps.bind(this)
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

  time(rowData) {
    if (rowData.object_type !== 'crm_task') {
      return 'All day'
    }

    return moment.unix(rowData.timestamp).format('hh:mm A')
  }

  getEventActions = row => {
    if (row.event_type === 'birthday') {
      return (
        <SendBirthdayCard
          contactId={row.contact}
          buttonStyle={{
            size: 'small'
          }}
        >
          Send a Card
        </SendBirthdayCard>
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
              <Title onClick={this.onTitleClick(rowData)}>
                {rowData.title}
              </Title>
              <Flex>
                {this.time(rowData)}
                <Indicator>|</Indicator>
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
    let onClick = () => {}

    switch (row.object_type) {
      case 'deal_context':
        onClick = () => goTo(`/dashboard/deals/${row.deal}`, 'Calendar')
        break

      case 'contact_attribute':
        onClick = () => goTo(`/dashboard/contacts/${row.contact}`, 'Calendar')
        break

      case 'crm_task':
        onClick = () => this.props.onSelectTask(row.crm_task)
        break
    }

    return onClick
  }

  getGridHeaderProps = () => ({
    style: {
      position: 'sticky',
      top: '0',
      zIndex: 5,
      backgroundColor: '#fff',
      padding: '5px 0'
    }
  })

  getGridHeaderRowProps = () => ({
    style: {
      marginBottom: 0
    }
  })

  getGridTrProps = (rowIndex, { original: row }) => {
    const props = {}

    if (row.object_type === 'crm_task') {
      props.style =
        row.status === 'DONE'
          ? { textDecoration: 'line-through', opacity: 0.5 }
          : {}
    }

    return {
      ...props,
      hoverStyle: `
        background-color: #fafafa;
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
        style: {
          textAlign: 'right',
          paddingRight: '1rem'
        }
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
            EmptyState={EmptyState}
            onTableRef={onRef}
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
    selectedDate: new Date(calendar.selectedDate),
    calendar: calendar.list,
    calendarDays: calendar.byDay
  }
}

export default connect(mapStateToProps)(Table)
