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

  render() {
    const defaultAssociation = {
      association_type: 'deal',
      deal: this.props.deal
    }

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
              defaultAssociation={defaultAssociation}
            />
          </Card>
        </MainContainer>
      </Fragment>
    )
  }
}
