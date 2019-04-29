import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'

import Table from 'components/Grid/Table'
import { formatDate } from 'components/DateTimePicker/helpers'

import Header from './Header'
import Layout from './Layout'
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

function Recipients(props) {
  if (!Array.isArray(props.data)) {
    return null
  }

  const recipients = recipientsList(props.data)

  const tagsCount = recipients.tags.length || 0
  const listCount = recipients.list.length || 0
  const emailsCount = recipients.emails.length || 0
  const contactsCount = recipients.contacts.length || 0
  const recipientsCount = emailsCount + contactsCount

  const items = []

  if (recipientsCount) {
    items.push(`${recipientsCount} Recipients`)
  }

  if (listCount) {
    items.push(`${listCount} List`)
  }

  if (tagsCount) {
    items.push(`${tagsCount} Tags`)
  }

  return <span>{items.join(', ')}</span>
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
      const isScheduled = !rowData.executed_at

      return (
        <>
          <Link
            to={
              isScheduled ? '' : `/dashboard/insights/campaigns/${rowData.id}`
            }
          >
            {rowData.subject.trim() || 'No Title'}
          </Link>
          <Info>
            <div className="sub-info">
              {isScheduled
                ? `Scheduled for ${formatDate(new Date(rowData.due_at * 1000))}`
                : formatDate(new Date(rowData.executed_at * 1000))}
            </div>
            <div className="main-info">
              <Recipients data={rowData.recipients} />
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

function recipientsList(recipients) {
  const list = []
  const tags = []
  const contacts = []
  const emails = []

  recipients.forEach(recipient => {
    if (recipient.tag) {
      tags.push(recipient.tag)
    } else if (recipient.list) {
      list.push(recipient.list)
    } else if (recipient.contact) {
      contacts.push(recipient.contact)
    } else {
      emails.push(recipient.email)
    }
  })

  return {
    list,
    tags,
    contacts,
    emails
  }
}

function List(props) {
  const { list, isLoading } = useListData(props.user)
  const [isSideMenuOpen, setSideMenuOpen] = useState(true)

  return (
    <Layout isSideMenuOpen={isSideMenuOpen} sentBadge={list.length}>
      <InsightContainer>
        <Header
          title="Sent Emails"
          isSideMenuOpen={isSideMenuOpen}
          onMenuTriggerChange={() => setSideMenuOpen(!isSideMenuOpen)}
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
    </Layout>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(List)
