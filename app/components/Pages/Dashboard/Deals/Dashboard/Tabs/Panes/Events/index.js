import React, { Fragment } from 'react'

import { searchEvents } from 'models/tasks/search-events'
import { normalizeDeal } from 'views/utils/association-normalizers'

import NewTask from 'views/CRM/Tasks/components/NewTask'
import { Timeline } from '../../../../../Contacts/Profile/Timeline'

import FactsheetsNav from '../../../FactsheetsNav'
import { FactsheetContainer, MainContainer, Card } from '../../styled'

export default class EventsPane extends React.Component {
  state = {
    isFetching: true,
    timeline: []
  }

  componentDidMount() {
    this.fetchTimeline()
  }

  get defaultAssociation() {
    return {
      association_type: 'deal',
      deal: normalizeDeal(this.props.deal)
    }
  }

  fetchTimeline = async () => {
    try {
      const response = await searchEvents({
        deal: this.props.deal.id,
        associations: ['crm_task.reminder', 'crm_task.associations']
      })

      this.setState({ isFetching: false, timeline: response.data })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
    }
  }

  addEvent = event =>
    this.setState(state => ({
      timeline: [event, ...state.timeline]
    }))

  filterTimelineById = (state, id) =>
    state.timeline.filter(item => item.id !== id)

  editEvent = updatedEvent =>
    this.setState(state => ({
      timeline: [
        ...this.filterTimelineById(state, updatedEvent.id),
        updatedEvent
      ]
    }))

  deleteEvent = id =>
    this.setState(state => ({
      timeline: this.filterTimelineById(state, id)
    }))

  render() {
    return (
      <Fragment>
        <FactsheetContainer>
          <FactsheetsNav
            deal={this.props.deal}
            isBackOffice={this.props.isBackOffice}
            showCriticalDatesDivider={false}
            showCDAInformation={false}
            showListingInformation={false}
            showContacts={false}
          />
        </FactsheetContainer>

        <MainContainer>
          <Card style={{ marginBottom: '1.5rem' }}>
            <NewTask
              user={this.props.user}
              submitCallback={this.addEvent}
              defaultAssociation={this.defaultAssociation}
            />
          </Card>

          <Timeline
            defaultAssociationId={this.props.deal.id}
            deleteEventHandler={this.deleteEvent}
            editEventHandler={this.editEvent}
            isFetching={this.state.isFetching}
            items={this.state.timeline}
            user={this.props.user}
          />
        </MainContainer>
      </Fragment>
    )
  }
}
