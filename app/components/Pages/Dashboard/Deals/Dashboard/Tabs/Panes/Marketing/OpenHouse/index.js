import React from 'react'
import Flex from 'styled-flex-component'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { confirmation } from 'actions/confirmation'
import ActionButton from 'components/Button/ActionButton'

import { CreateOpenHouse } from 'components/open-house/CreateOpenHouse'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import { getTasks, deleteTask } from 'models/tasks'

import { Title, Description, LeftColumn, RightColumn, Image } from '../styled'

import EventsList from './EventsList'

import { OpenHouseContainer } from './styled.js'

class OpenHouse extends React.Component {
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
    const events = this.state.events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    )

    this.setState({ events, selectedEvent: null })
  }

  onCreateEvent = event => {
    const events = [event, ...this.state.events]

    this.setState({
      events
    })

    this.props.notify({
      title: 'Open house created',
      message: `The open house ${event.title} has been created`,
      status: 'success'
    })
  }

  handleDeleteEvent = async event => {
    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: 'Delete open house event',
      onConfirm: async () => {
        await deleteTask(event.id)
        this.onDeleteEvent(event)
      },
      description: 'Are you sure you want to delete open house event?'
    })
  }

  onDeleteEvent = deletedEvent => {
    const events = this.state.events.filter(
      event => event.id !== deletedEvent.id
    )

    this.setState({ events, selectedEvent: null })

    this.props.notify({
      title: 'Open house deleted',
      status: 'success'
    })
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
          onDeleteEvent={this.handleDeleteEvent}
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

export default connect(
  null,
  {
    confirmation,
    notify
  }
)(OpenHouse)
