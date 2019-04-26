import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { formatDate } from 'components/DateTimePicker/helpers'
import Table from 'components/Grid/Table'

import Header from './Header'
import { Container } from '../../Contacts/components/Container'
import getCampaing from '../../../../../models/insights/emails/get-campaign-by-id'
import { PageContainer, PageWrapper } from '../../Contacts/Profile/styled'
import Loading from '../../../../Partials/Loading'

import { DetailsContainer, SummaryCard } from './styled'

function percent(num, allNum) {
  if (num == 0 || allNum === 0) {
    return 0
  }

  return num / allNum
}

function getEmail(email) {
  try {
    return email.email.to[0]
  } catch (e) {
    return ''
  }
}

function getContactStat(email) {
  // mutable const :)))
  const output = {
    unsubscribed: 0,
    failed: 0,
    opened: 0,
    clicked: 0
  }
  const sentEmail = email.email

  if (!sentEmail) {
    return output
  }

  output.unsubscribed = sentEmail.unsubscribed
  output.failed = sentEmail.failed
  output.opened = sentEmail.opened
  output.clicked = sentEmail.clicked

  return output
}

function contactsList(item) {
  const emails = item.emails

  if (!Array.isArray(emails)) {
    return []
  }

  return emails.map(email => ({
    id: email.id,
    display_name: email.display_name,
    profile_image_url: email.profile_image_url,
    to: getEmail(email),
    ...getContactStat(email)
  }))
}

const columns = [
  {
    header: 'Contact',
    id: 'contact',
    width: '50%',
    verticalAlign: 'center',
    // accessor: contact => getAttributeFromSummary(contact, 'display_name'),
    render: props => {
      const { rowData, rowIndex, totalRows } = props

      return (
        <>
          <div>{rowData.display_name}</div>
          <div>
            <div className="sub-info">{rowData.to}</div>
          </div>
        </>
      )
    }
  },
  {
    header: 'Open Rate',
    id: 'opened',
    verticalAlign: 'center',
    // accessor: contact => getAttributeFromSummary(contact, 'display_name'),
    render: props => {
      const { rowData, rowIndex, totalRows } = props

      return <span>{rowData.opened}</span>
    }
  },
  {
    header: 'Clicked',
    id: 'clicked',
    verticalAlign: 'center',
    // accessor: contact => getAttributeFromSummary(contact, 'display_name'),
    render: props => {
      const { rowData, rowIndex, totalRows } = props

      return <span>{rowData.clicked}</span>
    }
  }
]

function useItemData(id) {
  const [isLoading, setLoading] = useState(true)
  const [hasError, setError] = useState(false)
  const [item, setItem] = useState({})

  useEffect(() => {
    getCampaing(id).then(data => {
      setError(false)
      setLoading(false)
      setItem(data)
    })
    // .catch(() => {
    //   setError(true)
    //   setLoading(false)
    //   setItem([])
    // })
  }, [id])

  return {
    item,
    isLoading,
    hasError
  }
}

function Details(props) {
  const id = props.params.campaignId

  const { item, isLoading } = useItemData(id)

  if (isLoading) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <PageWrapper>
      {/* <Helmet>
        <title>Campaign Details</title>
      </Helmet> */}
      <PageContainer>
        <Header backUrl="/dashboard/insights" title={item.subject} />

        <DetailsContainer>
          <aside className="sidebar">
            <SummaryCard>
              <ul>
                <li>
                  <div className="field-name">Date</div>
                  <div className="field-value">
                    {formatDate(item.executed_at * 1000)}
                  </div>
                </li>
                <li>
                  <div className="field-name">Total Sent</div>
                  <div className="field-value">{item.recipients}</div>
                </li>
                <li>
                  <div className="field-name">Successful Deliveries</div>
                  <div className="field-value">{`${percent(
                    item.delivered,
                    item.recipients
                  )}% (${item.delivered})`}</div>
                </li>
                <li>
                  <div className="field-name">Open Rate</div>
                  <div className="field-value">{`${percent(
                    item.opened,
                    item.recipients
                  )}% (${item.opened})`}</div>
                </li>
                <li>
                  <div className="field-name">Bounced</div>
                  <div className="field-value">{`${percent(
                    item.failed,
                    item.recipients
                  )}% (${item.failed})`}</div>
                </li>
                <li>
                  <div className="field-name">Click Rate</div>
                  <div className="field-value">{`${percent(
                    item.clicked,
                    item.recipients
                  )}% (${item.clicked})`}</div>
                </li>
              </ul>
            </SummaryCard>
          </aside>
          <section className="sidebar">
            <Table
              data={contactsList(item)}
              columns={columns}
              // EmptyState={() => (
              //   <NoSearchResults description="Try typing another name, email, phone or tag." />
              // )}
            />
          </section>
        </DetailsContainer>
      </PageContainer>
    </PageWrapper>
  )
}

export default Details
