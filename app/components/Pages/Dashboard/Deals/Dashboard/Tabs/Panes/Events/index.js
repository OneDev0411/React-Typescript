import React, { Fragment } from 'react'

import NewTask from 'views/CRM/Tasks/components/NewTask'
// import { Timeline } from '../../../../../Contacts/Profile/Timeline'

import FactsheetSideNav from '../../components/FactsheetSideNav'
import { FactsheetContainer, MainContainer, Card } from '../../styled'

export default class EventsPane extends React.Component {
  state = {
    timeline: []
  }

  addEvent = event =>
    this.setState(state => ({
      timeline: [event, ...state.timeline]
    }))

  get DealAssociation() {
    const { deal } = this.props

    return {
      association_type: 'deal',
      deal: {
        type: 'deal',
        id: deal.id,
        title: deal.title,
        url: `/dashboard/deals/${deal.id}`,
        details: `${deal.deal_type}, ${deal.property_type}`,
        avatar: {
          image: null,
          placeHolderImage: '/static/icons/listing-place-holder.svg',
          size: 32
        }
      }
    }
  }

  render() {
    return (
      <Fragment>
        <FactsheetContainer>
          <FactsheetSideNav
            deal={this.props.deal}
            isBackOffice={this.props.isBackOffice}
            showCriticalDatesDivider={false}
            showCDAInformation={false}
            showListingInformation={false}
            showContacts={false}
          />
        </FactsheetContainer>

        <MainContainer>
          <Card>
            <NewTask
              user={this.props.user}
              submitCallback={this.addEvent}
              defaultAssociation={this.DealAssociation}
            />
          </Card>
        </MainContainer>
      </Fragment>
    )
  }
}
