import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'

import Header from './Header'
import Layout from './Layout'
import StatColumn from './StatColumn'
import { percent, doFilterOnColumns } from './helpers'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import Actions from './MarketingInsightsActions'
import InfoColumn from './InfoColumn'
import { InsightContainer } from './styled'
import useListData from './useListData'
import useFilterList from './useFilterList'
import { InsightFiltersType } from './types'
import { SortValues, doSort } from './helpers'

function List(props) {
  const [isSideMenuOpen, setSideMenuOpen] = useState(true)
  const [queue, setQueue] = useState(0)
  const [sort, setSort] = useState(SortValues.Newest)
  const { list, isLoading } = useListData(props.user, queue)
  const isScheduled = props.route && props.route.path === 'scheduled'
  const filterType = isScheduled
    ? InsightFiltersType.SCHEDULED
    : InsightFiltersType.SENT
  const { filteredList, stats } = useFilterList(list, filterType)
  const resultList = React.useMemo(() => doSort(filteredList, sort), [
    filteredList,
    sort
  ])

  React.useEffect(() => {
    window.socket.on('email_campaign:send', () => setQueue(queue => queue + 1))
  }, [])

  const tableClassName = ['insight-table-container']

  if (isLoading === false) {
    tableClassName.push('show')
  }

  const columns = useMemo(
    () => [
      {
        header: 'Details',
        id: 'details',
        width: '50%',
        verticalAlign: 'center',
        render: props => (
          <InfoColumn
            data={props.rowData}
            reloadList={() => setQueue(queue => queue + 1)}
          />
        )
      },
      {
        header: 'Delivered',
        id: 'delivered',
        verticalAlign: 'center',
        render: props =>
          props.rowData.executed_at ? (
            <StatColumn
              content={`${percent(
                props.rowData.delivered,
                props.rowData.sent
              )}%`}
              tooltipTitle={`${percent(
                props.rowData.failed,
                props.rowData.sent
              )}% Bounced`}
            />
          ) : null
      },
      {
        header: 'Open Rate',
        id: 'open-rate',
        verticalAlign: 'center',
        render: props =>
          props.rowData.executed_at ? (
            <StatColumn
              content={`${percent(props.rowData.opened, props.rowData.sent)}%`}
              tooltipTitle={`${props.rowData.opened} Recipients`}
            />
          ) : null
      },
      {
        header: 'Click Rate',
        id: 'click-rate',
        verticalAlign: 'center',
        render: props =>
          props.rowData.executed_at ? (
            <StatColumn
              content={`${percent(props.rowData.clicked, props.rowData.sent)}%`}
              tooltipTitle={`${props.rowData.clicked} Times`}
            />
          ) : null
      },
      {
        header: '',
        id: 'actions-th',
        verticalAlign: 'center',
        width: '2rem',
        render: props =>
          !props.rowData.executed_at ? (
            <Actions
              data={props.rowData}
              reloadList={() => setQueue(queue => queue + 1)}
            />
          ) : null
      }
    ],
    []
  )

  const sortableColumns = [
    { label: 'Newest', value: SortValues.Newest },
    { label: 'Oldest', value: SortValues.Oldest }
  ]

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
            data={resultList}
            columns={doFilterOnColumns(columns, filterType)}
            EmptyState={() => (
              <NoSearchResults description='Try sending your first campaign using "Send New Email" button.' />
            )}
            isFetching={isLoading}
            LoadingState={LoadingComponent}
            isHeaderSticky
            isToolbarSticky={false}
            plugins={{
              sortable: {
                columns: sortableColumns,
                defaultIndex: sort,
                onChange: ({ value }) => setSort(value)
              }
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
