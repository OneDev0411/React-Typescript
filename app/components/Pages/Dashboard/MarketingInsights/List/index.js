import React, { useState } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'

import Header from './Header'
import Layout from './Layout'
import StatColumn from './StatColumn'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import { InsightContainer } from './styled'
import useListData from './useListData'
import InfoColumn from './InfoColumn'

const columns = [
  {
    header: 'Details',
    id: 'details',
    width: '50%',
    verticalAlign: 'center',
    render: props => <InfoColumn data={props.rowData} />
  },
  {
    header: 'Open Rate',
    id: 'open-rate',
    verticalAlign: 'center',
    render: props => (
      <StatColumn
        num={props.rowData.opened}
        all={props.rowData.sent}
        title="recipients"
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
        num={props.rowData.clicked}
        all={props.rowData.sent}
        title="times"
        isVisibile={!!props.rowData.executed_at}
      />
    )
  }
]

function List(props) {
  const [isSideMenuOpen, setSideMenuOpen] = useState(true)
  const [queue, setQueue] = useState(0)
  const { list, isLoading } = useListData(props.user, queue)
  const tableClassName = ['insight-table-container']

  if (isLoading === false) {
    tableClassName.push('show')
  }

  return (
    <Layout isSideMenuOpen={isSideMenuOpen} sentBadge={list.length}>
      <InsightContainer>
        <Header
          title="Sent Emails"
          isSideMenuOpen={isSideMenuOpen}
          onMenuTriggerChange={() => setSideMenuOpen(!isSideMenuOpen)}
          onSent={() => setQueue(queue + 1)}
        />

        {isLoading && <LoadingComponent />}
        <div className={tableClassName.join(' ')}>
          <Table
            data={list}
            columns={columns}
            EmptyState={() => (
              <NoSearchResults description='Try sending your first campaign using "Send New Email" button.' />
            )}
            isFetching={isLoading}
            LoadingState={LoadingComponent}
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
