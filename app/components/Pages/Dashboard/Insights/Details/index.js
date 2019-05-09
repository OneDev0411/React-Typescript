import React from 'react'
import { Helmet } from 'react-helmet'

import { formatDate } from 'components/DateTimePicker/helpers'
import Table from 'components/Grid/Table'
import ContactInfo from 'components/ContactInfo'

import Header from './Header'
import { Container } from '../../Contacts/components/Container'
import { PageContainer, PageWrapper } from '../../Contacts/Profile/styled'
import Loading from '../../../../Partials/Loading'

import { percent } from '../Main/helpers'

import { DetailsContainer, SummaryCard, ContactColumn } from './styled'
import { contactsList } from './helpers'
import useItemData from './useItemData'
import RowBadges from './RowBadges'
import Summary from './Summary'

const columns = [
  {
    header: 'Contact',
    id: 'contact',
    width: '75%',
    verticalAlign: 'center',
    render: props => (
      <ContactColumn>
        <div>
          <ContactInfo data={props.rowData} />
        </div>
        <div className="labels-container">
          <RowBadges data={props.rowData} />
        </div>
      </ContactColumn>
    )
  },
  {
    header: 'Open Rate',
    id: 'opened',
    verticalAlign: 'center',
    render: props => <span>{props.rowData.opened}</span>
  },
  {
    header: 'Clicked',
    id: 'clicked',
    verticalAlign: 'center',
    render: props => <span>{props.rowData.clicked}</span>
  }
]

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

  const totalSent = Array.isArray(item.emails) ? item.emails.length : 0
  const summaryItems = [
    { name: 'Date', value: formatDate(item.executed_at * 1000) },
    { name: 'Total Sent', value: totalSent },
    {
      name: 'Successful Deliveries',
      value: `${percent(item.delivered, totalSent)}% (${item.delivered})`
    },
    {
      name: 'Open Rate',
      value: `${percent(item.opened, totalSent)}% (${item.opened})`
    },
    {
      name: 'Bounced',
      value: `${percent(item.failed, totalSent)}% (${item.failed})`
    },
    {
      name: 'Click Rate',
      value: `${percent(item.clicked, totalSent)}% (${item.clicked})`
    }
  ]
  const sentFrom = {
    display_name: '',
    to: '',
    profile_image_url: ''
  }

  if (item.from) {
    sentFrom.profile_image_url = item.from.profile_image_url
    sentFrom.to = item.from.email
    sentFrom.display_name = item.from.display_name
  }

  return (
    <PageWrapper>
      <Helmet>
        <title>Campaign Details | Insights | Rechat</title>
      </Helmet>
      <PageContainer>
        <Header backUrl="/dashboard/insights" title={item.subject} />

        <DetailsContainer>
          <aside className="sidebar">
            <SummaryCard>
              <Summary items={summaryItems} />
              {item.from && (
                <div className="sent-from">
                  <div className="title">Sent From</div>
                  <ContactInfo data={sentFrom} />
                </div>
              )}
            </SummaryCard>
          </aside>
          <section className="sidebar">
            <Table data={contactsList(item)} columns={columns} />
          </section>
        </DetailsContainer>
      </PageContainer>
    </PageWrapper>
  )
}

export default Details
