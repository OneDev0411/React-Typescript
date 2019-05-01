import React, { useState } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'
import { formatDate } from 'components/DateTimePicker/helpers'

import Header from './Header'
import Layout from './Layout'
import StatColumn from './StatColumn'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import { InsightContainer, Link, Info } from './styled'
import { show_title } from './helpers'
import useListData from './useListData'
import Recipients from './Recipients'

const columns = [
  {
    header: 'Details',
    id: 'details',
    width: '50%',
    verticalAlign: 'center',
    render: props => {
      const isScheduled = !props.rowData.executed_at

      return (
        <>
          <Link
            to={
              isScheduled
                ? ''
                : `/dashboard/insights/campaigns/${props.rowData.id}`
            }
          >
            {show_title(props.rowData.subject)}
          </Link>
          <Info>
            <div className="sub-info">
              {isScheduled
                ? `Scheduled for ${formatDate(
                    new Date(props.rowData.due_at * 1000)
                  )}`
                : formatDate(new Date(props.rowData.executed_at * 1000))}
            </div>
            <div className="main-info">
              <Recipients data={props.rowData.recipients} />
            </div>
          </Info>
        </>
      )
    }
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
      />
    )
  }
]

function List(props) {
  const { list, isLoading } = useListData(props.user)
  const [isSideMenuOpen, setSideMenuOpen] = useState(true)
  const tableClassName = ['table-container']

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
        />

        <div className={tableClassName.join(' ')}>
          <Table
            data={list}
            columns={columns}
            isFetching={isLoading}
            EmptyState={() => (
              <NoSearchResults description="Try sending your first campaign using " />
            )}
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
