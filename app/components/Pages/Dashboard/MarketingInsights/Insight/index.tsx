import React from 'react'
import { Helmet } from 'react-helmet'
import Dialog from '@material-ui/core/Dialog'

import { formatDate } from 'components/DateTimePicker/helpers'
import ContactInfo from 'components/ContactInfo'

import { EmailThread } from 'components/EmailThread'

import { getEmailCampaignEmail } from 'models/email/helpers/get-email-campaign-email'

import Header from './Header'
import { Container } from '../../Contacts/components/Container'
import { PageWrapper } from '../../Contacts/Profile/styled'
import Loading from '../../../../Partials/Loading'

import { percent } from '../List/helpers'

import { InsightContainer, PageContainer, SummaryCard } from './styled'
import useItemData from './useItemData'
import Summary from './Summary'
import ContactsTable from './ContactsTable'
import { ContactsListType } from './types'

interface InsightPropsType {
  params: {
    id: string
  }
}

function Insight(props: InsightPropsType) {
  const { id } = props.params

  const [isOpenViewEmail, setOpenViewEmail] = React.useState(false)
  const { item, isLoading } = useItemData(id)
  const email = item && getEmailCampaignEmail(item)

  if (isLoading) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  if (!item) {
    // TODO: Adding a fallback (This useful for when a request failing, or a user doesn't have access to the item.)
    return null
  }

  const totalSent = item.sent
  const summaryItems = [
    { name: 'Date', value: formatDate(item.executed_at! * 1000) },
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
  const sentFrom: ContactsListType = {
    display_name: '',
    to: '',
    profile_image_url: ''
    // TODO(mojtaba): fix missing fields either make them optional in type
    //  definition, or provide them here
  } as ContactsListType

  if (item.from) {
    sentFrom.profile_image_url = item.from.profile_image_url
    sentFrom.to = item.from.email
    sentFrom.display_name = item.from.display_name || ''
  }

  const { subject } = item

  const closeEmailView = () => setOpenViewEmail(false)

  return (
    <PageWrapper>
      <Helmet>
        <title>{`${
          subject ? `${subject} | ` : ''
        }Marketing Insights | Rechat`}</title>
      </Helmet>
      <PageContainer>
        <Header
          backUrl="/dashboard/insights"
          title={subject}
          onViewEmail={() => setOpenViewEmail(true)}
        />
        <Dialog
          maxWidth="lg"
          fullWidth
          onClose={closeEmailView}
          open={isOpenViewEmail}
        >
          {email && (
            <EmailThread
              messages={[email]}
              subject={email.subject}
              onClose={closeEmailView}
            />
          )}
        </Dialog>
        <InsightContainer>
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
            <ContactsTable item={item} />
          </section>
        </InsightContainer>
      </PageContainer>
    </PageWrapper>
  )
}

export default Insight
