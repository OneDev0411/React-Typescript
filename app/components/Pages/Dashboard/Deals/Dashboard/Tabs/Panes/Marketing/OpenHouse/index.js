import React from 'react'
import Flex from 'styled-flex-component'
import { connect } from 'react-redux'

import { Button } from '@material-ui/core'

import { addNotification as notify } from 'components/notification'

import { confirmation } from 'actions/confirmation'

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
    this.setState(state => ({
      selectedEvent: null,
      events: state.events.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    }))

    this.props.notify({
      title: 'Open house updated',
      message: `The open house ${updatedEvent.title} has been updated`,
      status: 'success'
    })
  }

  onCreateEvent = event => {
    this.setState(state => ({
      events: [event, ...state.events]
    }))

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
    this.setState(state => ({
      selectedEvent: null,
      events: state.events.filter(event => event.id !== deletedEvent.id)
    }))

    this.props.notify({
      message: 'Open house deleted',
      status: 'success'
    })
  }

  render() {
    return (
      <OpenHouseContainer>
        <Flex style={{ padding: '1.5rem 3.5rem' }}>
          <LeftColumn>
            <Title>Open House Registration Pages</Title>
            <Description>Customize your open house registration.</Description>

            <CreateOpenHouse
              user={this.props.user}
              submitCallback={this.onCreateEvent}
              associations={{ deal: this.props.deal }}
            >
              <Button color="secondary" variant="contained">
                Create Registration Page
              </Button>
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
            association={{ deal: this.props.deal }}
            onClose={this.handleCloseDrawer}
            submitCallback={this.onUpdateEvent}
            deleteCallback={this.onDeleteEvent}
          />
        )}
      </OpenHouseContainer>
    )
  }
}

export default connect(null, {
  confirmation,
  notify
})(OpenHouse)
