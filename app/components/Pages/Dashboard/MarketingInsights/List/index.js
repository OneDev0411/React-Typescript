import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'

import { makeStyles, createStyles } from '@material-ui/core'

import Table from 'components/Grid/Table'

import { useGridStyles } from 'components/Grid/Table/styles'

import Layout from './Layout'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import Actions from './MarketingInsightsActions'
import ThumbnailColumn from './Column/Thumbnail'
import TitleColumn from './Column/Title'
import RecipientsColumn from './Column/Recipients'
import StatsColumn from './Column/Stats'
import { InsightContainer } from './styled'
import useListData from './useListData'
import { InsightFiltersType } from './types'
import { percent } from './helpers'

const useCustomGridStyles = makeStyles(theme =>
  createStyles({
    row: {
      '& td': {
        '&.actions svg': {
          fill: theme.palette.grey['500']
        }
      },
      '&:hover td': {
        '&.actions svg': {
          fill: theme.palette.text.primary
        }
      }
    }
  })
)

function List(props) {
  const customGridClasses = useCustomGridStyles()
  const [queue, setQueue] = useState(0)
  const isScheduled = props.route && props.route.path === 'scheduled'
  const filterType = isScheduled
    ? InsightFiltersType.SCHEDULED
    : InsightFiltersType.SENT
  const { isLoading, hasError, list, stats } = useListData(
    props.user,
    queue,
    filterType
  )
  const gridClasses = useGridStyles()

  React.useEffect(() => {
    window.socket.on('email_campaign:send', () => setQueue(queue => queue + 1))
  }, [])

  const columns = useMemo(
    () => [
      {
        header: 'Thumbnail',
        id: 'thumbnail',
        class: 'opaque',
        width: 70,
        verticalAlign: 'center',
        render: ({ row }) => <ThumbnailColumn data={row} />
      },
      {
        header: 'Title',
        id: 'title-date',
        primary: true,
        width: '32%',
        verticalAlign: 'center',
        accessor: row => row.due_at,
        render: ({ row }) => (
          <TitleColumn
            data={row}
            reloadList={() => setQueue(queue => queue + 1)}
          />
        )
      },
      {
        header: 'Recipients',
        id: 'recipients',
        class: 'opaque',
        width: '26%',
        verticalAlign: 'center',
        render: ({ row }) => <RecipientsColumn data={row.recipients} />
      },
      {
        header: 'Delivered',
        id: 'delivered',
        class: 'opaque',
        width: '14%',
        verticalAlign: 'center',
        render: ({ row: { executed_at, delivered, sent, failed } }) => {
          if (!executed_at) {
            return null
          }

          const value = `${percent(delivered, sent)}%`

          return (
            <StatsColumn
              title={`Delivered: ${value}`}
              details={`${percent(failed, sent)} Bounced`}
            />
          )
        }
      },
      {
        header: 'Open Rate',
        id: 'open-rate',
        class: 'opaque',
        width: '14%',
        verticalAlign: 'center',
        render: ({ row: { executed_at, opened, sent } }) => {
          if (!executed_at) {
            return null
          }

          const value = `${percent(opened, sent)}%`

          return (
            <StatsColumn
              title={`Open Rate: ${value}`}
              details={`${opened} Recipients`}
            />
          )
        }
      },
      {
        header: 'Click Rate',
        id: 'click-rate',
        class: 'opaque',
        width: '14%',
        verticalAlign: 'center',
        render: ({ row: { executed_at, clicked, sent } }) => {
          if (!executed_at) {
            return null
          }

          const value = `${percent(clicked, sent)}%`

          return (
            <StatsColumn
              title={`Click Rate: ${value}`}
              details={`${clicked} Times`}
            />
          )
        }
      },
      {
        header: '',
        id: 'actions-th',
        class: 'actions',
        verticalAlign: 'center',
        width: '2rem',
        render: ({ row }) =>
          !row.executed_at && (
            <Actions
              data={row}
              reloadList={() => setQueue(queue => queue + 1)}
            />
          )
      }
    ],
    []
  )

  const renderContent = ({ sortBy, onChangeSort }) => {
    if (isLoading) {
      return <LoadingComponent />
    }

    if (hasError) {
      return (
        <NoSearchResults description='Try sending your first campaign using "Create" button and click on "Email".' />
      )
    }

    return (
      <Table
        rows={list}
        totalRows={list.length}
        columns={columns}
        EmptyStateComponent={() => (
          <NoSearchResults description='Try sending your first campaign using "Create" button and click on "Email".' />
        )}
        sorting={{
          sortBy: {
            value: sortBy.value,
            ascending: sortBy.ascending
          },
          onChange: onChangeSort
        }}
        classes={{
          row: cn(gridClasses.row, customGridClasses.row)
        }}
      />
    )
  }

  return (
    <Layout
      sentCount={stats.sent}
      scheduledCount={stats.scheduled}
      onCreateEmail={() => setQueue(queue => queue + 1)}
      renderContent={props => (
        <InsightContainer>{renderContent(props)}</InsightContainer>
      )}
    />
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(List)
