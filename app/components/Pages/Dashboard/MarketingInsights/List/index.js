import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'

import Layout from './Layout'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import Actions from './MarketingInsightsActions'
import ThumbnailColumn from './Column/Thumbnail'
import TitleColumn from './Column/Title'
import DateColumn from './Column/Date'
import RecipientsColumn from './Column/Recipients'
import StatsColumn from './Column/Stats'
import { InsightContainer } from './styled'
import useListData from './useListData'
import useFilterList from './useFilterList'
import { InsightFiltersType } from './types'

function List(props) {
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
        header: 'Thumbnail',
        id: 'thumbnail',
        width: 70,
        verticalAlign: 'center',
        render: ({ row }) => <ThumbnailColumn data={row} />
      },
      {
        header: 'Title',
        id: 'title',
        width: '25%',
        verticalAlign: 'center',
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
        width: '25%',
        verticalAlign: 'center',
        render: ({ row }) => <RecipientsColumn data={row.recipients} />
      },
      {
        header: 'Date',
        id: 'date',
        width: '25%',
        verticalAlign: 'center',
        render: ({ row }) => <DateColumn data={row} />
      },
      {
        header: 'Stats',
        id: 'stats',
        width: '7%',
        verticalAlign: 'center',
        render: ({ row }) => <StatsColumn data={row} />
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
      sentCount={stats.sent}
      scheduledCount={stats.scheduled}
      renderContent={({ sortBy, onChangeSort }) => (
        <InsightContainer>
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
                sortBy: {
                  value: sortBy.value,
                  ascending: sortBy.ascending
                },
                onChange: onChangeSort
              }}
            />
          </div>
        </InsightContainer>
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
