import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'

import Header from './Header'
import Layout from './Layout'
import StatColumn from './StatColumn'
import { percent } from './helpers'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import InfoColumn from './InfoColumn'
import { InsightContainer } from './styled'
import useListData from './useListData'
import useFilterList from './useFilterList'
import { InsightFiltersType } from './types'

function List(props) {
  const [isSideMenuOpen, setSideMenuOpen] = useState(true)
  const [queue, setQueue] = useState(0)
  const { list, isLoading } = useListData(props.user, queue)
  const isScheduled = props.route && props.route.path === 'scheduled'
  const filterType = isScheduled
    ? InsightFiltersType.SCHEDULED
    : InsightFiltersType.SENT
  const { filteredList, stats } = useFilterList(list, filterType)
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
            reload={() => setQueue(queue => queue + 1)}
          />
        )
      },
      {
        header: 'Delivered',
        id: 'delivered',
        verticalAlign: 'center',
        render: props => (
          <StatColumn
            content={`${percent(props.rowData.delivered, props.rowData.sent)}%`}
            tooltipTitle={`${percent(
              props.rowData.failed,
              props.rowData.sent
            )}% Bounced`}
            isVisibile={!!props.rowData.executed_at}
          />
        )
      },
      {
        header: 'Open Rate',
        id: 'open-rate',
        verticalAlign: 'center',
        render: props => (
          <StatColumn
            content={`${percent(props.rowData.opened, props.rowData.sent)}%`}
            tooltipTitle={`${props.rowData.opened} Recipients`}
            isVisibile={!!props.rowData.executed_at}
          />
        )
      },
      {
        header: 'Click Rate',
        id: 'click-rate',
        verticalAlign: 'center',
        render: props => (
          <StatColumn
            content={`${percent(props.rowData.clicked, props.rowData.sent)}%`}
            tooltipTitle={`${props.rowData.clicked} Times`}
            isVisibile={!!props.rowData.executed_at}
          />
        )
      }
    ],
    []
  )

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
            data={filteredList}
            columns={isScheduled ? [columns[0]] : columns}
            EmptyState={() => (
              <NoSearchResults description='Try sending your first campaign using "Send New Email" button.' />
            )}
            isFetching={isLoading}
            LoadingState={LoadingComponent}
            showToolbar={false}
            isHeaderSticky
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
