import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'
import { formatDate } from 'components/DateTimePicker/helpers'

import Header from './Header'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'
import getCampaings from '../../../../../models/insights/emails/get-all-campaigns'

import { InsightContainer, Link, Info } from './styled'

function percent(num, allNum) {
  if (num === 0 || allNum === 0) {
    return 0
  }

  return num / allNum
}

const columns = [
  {
    header: 'Details',
    id: 'details',
    width: '50%',
    verticalAlign: 'center',
    // accessor: contact => getAttributeFromSummary(contact, 'display_name'),
    render: props => {
      const { rowData, rowIndex, totalRows } = props

      return (
        <>
          <Link to={`/dashboard/insights/campaigns/${rowData.id}`}>
            {rowData.subject.trim() || 'No Title'}
          </Link>
          <Info>
            <div className="sub-info">
              {formatDate(new Date(rowData.created_at * 1000))}
            </div>
            <div className="main-info">{`${
              rowData.recipients
            } Recipients`}</div>
          </Info>
        </>
      )
    }
  },
  {
    header: 'Open Rate',
    id: 'open-rate',
    verticalAlign: 'center',
    // accessor: contact => getAttributeFromSummary(contact, 'display_name'),
    render: props => {
      const { rowData, rowIndex, totalRows } = props
      const opened = percent(rowData.opened, rowData.recipients)

      return <span>{opened}%</span>
    }
  },
  {
    header: 'Click Rate',
    id: 'click-rate',
    verticalAlign: 'center',
    // accessor: contact => getAttributeFromSummary(contact, 'display_name'),
    render: props => {
      const { rowData, rowIndex, totalRows } = props
      const clicked = percent(rowData.clicked, rowData.recipients)

      return <span>{clicked}%</span>
    }
  }
]

function useListData(user) {
  const [isLoading, setLoading] = useState(true)
  const [hasError, setError] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    getCampaings(user).then(data => {
      setError(false)
      setLoading(false)
      setList(data)
    })
    // .catch(() => {
    //   setError(true)
    //   setLoading(false)
    //   setList([])
    // })
  }, [user])

  return {
    list,
    isLoading,
    hasError
  }
}

function List(props) {
  const { list, isLoading } = useListData(props.user)

  return (
    <InsightContainer>
      <Header
        title="Sent Emails"
        isSideMenuOpen={props.isSideMenuOpen}
        onMenuTriggerChange={props.toggleSideMenu}
      />

      <div className="table-container">
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
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(List)
