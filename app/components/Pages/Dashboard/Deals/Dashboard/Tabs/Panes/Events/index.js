import React from 'react'

import getCRMTimeline from 'models/get-crm-timeline'
import NewTask from 'components/NewEvent'
import { normalizeDeal } from 'views/utils/association-normalizers'

import { Timeline } from './Timeline'
import FactsheetsNav from '../../../FactsheetsNav'
import { FactsheetContainer, MainContainer, Card } from '../../styled'

export default class EventsPane extends React.Component {
  state = {
    isFetching: true,
    timeline: []
  }

  componentDidMount() {
    this.fetchTimeline()

    window.socket.on('crm_task:create', this.fetchTimeline)
    window.socket.on('email_campaign:create', this.fetchTimeline)
  }

  componentWillUnmount() {
    window.socket.off('crm_task:create', this.fetchTimeline)
    window.socket.off('email_campaign:create', this.fetchTimeline)
  }

  defaultAssociation = {
    association_type: 'deal',
    deal: normalizeDeal(this.props.deal)
  }

  fetchTimeline = async () => {
    try {
      const timeline = await getCRMTimeline({
        deal: this.props.deal.id
      })

      this.setState({ isFetching: false, timeline })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
    }
  }

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
      <>
        <FactsheetContainer>
          <FactsheetsNav
            deal={this.props.deal}
            isBackOffice={this.props.isBackOffice}
            isFetchingContexts={this.props.isFetchingContexts}
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
              defaultAssociation={this.defaultAssociation}
              submitCallback={this.fetchTimeline}
            />
          </Card>

          <Timeline
            defaultAssociation={this.defaultAssociation}
            deleteEventHandler={this.deleteEvent}
            editEventHandler={this.editEvent}
            isFetching={this.state.isFetching}
            items={this.state.timeline}
            user={this.props.user}
          />
        </MainContainer>
      </>
    )
  }
}
