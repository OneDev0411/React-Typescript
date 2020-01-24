import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'

import Header from './Header'
import Layout from './Layout'
import StatColumn from './StatColumn'
import { percent } from './helpers'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import Actions from './MarketingInsightsActions'
import InfoColumn from './InfoColumn'
import { InsightContainer } from './styled'
import useListData from './useListData'
import useFilterList from './useFilterList'
import { InsightFiltersType } from './types'
import { SortValues } from './helpers'

const sortableColumns = [
  { label: 'Newest', value: SortValues.Newest, ascending: true },
  { label: 'Oldest', value: SortValues.Oldest, ascending: false }
]

function List(props) {
  const [isSideMenuOpen, setSideMenuOpen] = useState(true)
  const [queue, setQueue] = useState(0)
  const { list, isLoading } = useListData(props.user, queue)
  const isScheduled = props.route && props.route.path === 'scheduled'
  const filterType = isScheduled
    ? InsightFiltersType.SCHEDULED
    : InsightFiltersType.SENT
  const { filteredList, stats } = useFilterList(list, filterType)

  React.useEffect(() => {
    window.socket.on('email_campaign:send', () => setQueue(queue => queue + 1))
  }, [])

  const tableClassName = ['insight-table-container']

  const columns = useMemo(
    () => [
      {
        header: 'Details',
        id: 'details',
        width: '50%',
        verticalAlign: 'center',
        render: ({ row }) => (
          <InfoColumn
            data={row}
            reloadList={() => setQueue(queue => queue + 1)}
          />
        )
      },
      {
        header: 'Delivered',
        id: 'delivered',
        verticalAlign: 'center',
        render: ({ row }) =>
          row.executed_at ? (
            <StatColumn
              content={`${percent(row.delivered, row.sent)}%`}
              tooltipTitle={`${percent(row.failed, row.sent)}% Bounced`}
            />
          ) : null
      },
      {
        header: 'Open Rate',
        id: 'open-rate',
        verticalAlign: 'center',
        render: ({ row }) =>
          row.executed_at ? (
            <StatColumn
              content={`${percent(row.opened, row.sent)}%`}
              tooltipTitle={`${row.opened} Recipients`}
            />
          ) : null
      },
      {
        header: 'Click Rate',
        id: 'click-rate',
        verticalAlign: 'center',
        render: ({ row }) =>
          row.executed_at ? (
            <StatColumn
              content={`${percent(row.clicked, row.sent)}%`}
              tooltipTitle={`${row.clicked} Times`}
            />
          ) : null
      },
      {
        header: '',
        id: 'actions-th',
        verticalAlign: 'center',
        width: '2rem',
        render: ({ row }) =>
          !row.executed_at ? (
            <Actions
              data={row}
              reloadList={() => setQueue(queue => queue + 1)}
            />
          ) : null
      }
    ],
    []
  )

  if (isLoading === false) {
    tableClassName.push('show')
  }

  return (
    <Layout
      isSideMenuOpen={isSideMenuOpen}
      sentCount={stats.sent}
      scheduledCount={stats.scheduled}
    >
      <InsightContainer>
        <Header
          title={isScheduled ? 'Scheduled Emails' : 'Sent Emails'}
          isSideMenuOpen={isSideMenuOpen}
          onMenuTriggerChange={() => setSideMenuOpen(!isSideMenuOpen)}
          onSent={() => setQueue(queue => queue + 1)}
        />

        {isLoading && <LoadingComponent />}
        <div className={tableClassName.join(' ')}>
          <Table
            rows={filteredList}
            totalRows={(filteredList || []).length}
            columns={columns}
            EmptyStateComponent={() => (
              <NoSearchResults description='Try sending your first campaign using "Send New Email" button.' />
            )}
            loading={isLoading ? 'middle' : null}
            LoadingStateComponent={LoadingComponent}
            sorting={{
              columns: sortableColumns
            }}
          />
        </div>
      </InsightContainer>
    </Layout>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(List)
