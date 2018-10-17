import React from 'react'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'

import { CreateOpenHouse } from 'components/open-house/CreateOpenHouse'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import { getTasks } from 'models/tasks/get-tasks'

import { Title, Description, LeftColumn, RightColumn, Image } from '../styled'

import EventsList from './EventsList'

import { OpenHouseContainer } from './styled.js'

export default class OpenHouse extends React.Component {
  state = {
    isFetching: false,
    events: [],
    selectedEvent: null
  }

  componentDidMount() {
    this.fetchEvents()
  }

  fetchEvents = async () => {
    this.setState({ isFetching: true })

    try {
      const { data: events } = await getTasks({
        deal: this.props.deal.id,
        task_type: 'Open House'
      })

      this.setState({ events, isFetching: false })
    } catch (e) {
      this.setState({ isFetching: false })
    }
  }

  handleEditEvent = event =>
    this.setState({
      selectedEvent: event
    })

  handleCloseDrawer = () =>
    this.setState({
      selectedEvent: null
    })

  onUpdateEvent = updatedEvent => {
    const events = this.state.events.map(
      event => (event.id === updatedEvent.id ? updatedEvent : event)
    )

    this.setState({ events, selectedEvent: null })
  }

  onCreateEvent = event => {
    const events = [event, ...this.state.events]

    this.setState({
      events
    })
  }

  onDeleteEvent = deletedEvent => {
    const events = this.state.events.filter(
      event => event.id !== deletedEvent.id
    )

    this.setState({ events, selectedEvent: null })
  }

  render() {
    return (
      <OpenHouseContainer>
        <Flex style={{ padding: '1.5rem 3.5rem' }}>
          <LeftColumn>
            <Title>Open House</Title>
            <Description>Customize your open house registration.</Description>

            <CreateOpenHouse
              deal={this.props.deal}
              user={this.props.user}
              submitCallback={this.onCreateEvent}
            >
              <ActionButton>Create Open House</ActionButton>
            </CreateOpenHouse>
          </LeftColumn>

          <RightColumn>
            <Image
              src="/static/images/deals/openhouse/open-house-graphic@3x.png"
              alt=""
            />
          </RightColumn>
        </Flex>

        <EventsList
          events={this.state.events}
          isFetching={this.state.isFetching}
          user={this.props.user}
          onEditEvent={this.handleEditEvent}
        />

        {this.state.selectedEvent && (
          <OpenHouseDrawer
            isOpen
            openHouseId={this.state.selectedEvent.id}
            user={this.props.user}
            deal={this.props.deal}
            onClose={this.handleCloseDrawer}
            submitCallback={this.onUpdateEvent}
            deleteCallback={this.onDeleteEvent}
          />
        )}
      </OpenHouseContainer>
    )
  }
}
