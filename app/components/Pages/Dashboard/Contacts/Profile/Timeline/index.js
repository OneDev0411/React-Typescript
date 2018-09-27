import React from 'react'
import _ from 'underscore'

import Loading from '../../../../../Partials/Loading'
import { EditNoteDrawer } from '../../../../../../views/components/EditNoteDrawer'
import { EventDrawer } from '../../../../../../views/components/EventDrawer'

import { Card } from '../styled'
import { NoteItem } from './NoteItem'
import { CRMTaskItem } from './TaskItem'
import { EmptyState } from './EmptyState'
import { Container, Title } from './styled'

export class Timeline extends React.Component {
  state = {
    selectedNote: null,
    selectedEvent: null
  }

  onClickNote = selectedNote => this.setState({ selectedNote })
  closeEditNoteDrawer = () => this.setState({ selectedNote: null })

  closeEventDrawer = () => this.setState({ selectedEvent: null })
  onClickEvent = selectedEvent => this.setState({ selectedEvent })

  handleEditEvent = updatedEvent => {
    this.closeEventDrawer()
    this.props.editEventHandler(updatedEvent)
  }

  handleDeleteEvent = deletedEvent => {
    this.closeEventDrawer()
    this.props.deleteEventHandler(deletedEvent.id)
  }

  renderItems = month => (
    <React.Fragment>
      <Title>
        <b>{month.title}</b>
      </Title>
      <Card>
        {month.items.map(activity => {
          const key = `timeline_item_${activity.id}`

          if (activity.type === 'crm_task') {
            return (
              <CRMTaskItem
                contact={this.props.contact}
                key={key}
                task={activity}
                onClick={this.onClickEvent}
                editCallback={this.props.editEventHandler}
              />
            )
          }

          if (
            activity.type === 'contact_attribute' &&
            activity.attribute_type === 'note'
          ) {
            return (
              <NoteItem
                contact={this.props.contact}
                key={key}
                note={activity}
                onClick={this.onClickNote}
              />
            )
          }
        })}
      </Card>
    </React.Fragment>
  )

  render() {
    if (this.props.isFetching) {
      return <Loading />
    }

    if (this.props.items.length === 0) {
      return <EmptyState />
    }

    const upcomingEvents = []
    const pastEventsIndexedInMonths = {}

    this.props.items.forEach(item => {
      let date
      let { due_date } = item

      function getDateMonthAndYear(date) {
        date = new Date(date)

        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]

        const monthNumber = date.getMonth()
        const year = date.getFullYear()

        const index = `${monthNumber}_${year}`

        const title = `${months[monthNumber]} ${year}`

        return {
          index,
          title
        }
      }

      if (due_date) {
        due_date *= 1000

        if (due_date > new Date().getTime()) {
          return upcomingEvents.push(item)
        }

        date = new Date(due_date)
      } else {
        date = new Date(item.created_at * 1000)
      }

      const monthAndYear = getDateMonthAndYear(date)

      if (pastEventsIndexedInMonths[monthAndYear.index]) {
        pastEventsIndexedInMonths[monthAndYear.index].items.push(item)
      } else {
        pastEventsIndexedInMonths[monthAndYear.index] = {
          title: monthAndYear.title,
          items: [item]
        }
      }
    })

    let sortedPastEvents = []

    if (Object.keys(pastEventsIndexedInMonths).length > 0) {
      sortedPastEvents = Object.keys(pastEventsIndexedInMonths).sort((a, b) => {
        const [aMonth, aYear] = a.split('_')
        const [bMonth, bYear] = b.split('_')

        if (aYear === bYear) {
          return bMonth - aMonth
        }

        return bYear - aYear
      })
    }

    return (
      <div>
        {upcomingEvents.length > 0 && (
          <Container id="upcoming_events" key="upcoming_events">
            {this.renderItems({
              title: 'Upcoming Events',
              items: upcomingEvents.sort((a, b) => a.due_date > b.due_date)
            })}
          </Container>
        )}

        {sortedPastEvents.length > 0 &&
          sortedPastEvents.map(monthIndex => {
            const month = pastEventsIndexedInMonths[monthIndex]
            const id = month.title.replace(' ', '_')

            return (
              <Container id={id} key={`past_events_${id}`}>
                {this.renderItems({
                  title: month.title,
                  items: _.sortBy(
                    month.items,
                    item =>
                      item.due_date != null ? !item.due_date : !item.created_at
                  )
                })}
              </Container>
            )
          })}

        {this.state.selectedNote && (
          <EditNoteDrawer
            isOpen
            note={this.state.selectedNote}
            onClose={this.closeEditNoteDrawer}
            onSubmit={this.props.editNoteHandler}
            onDelete={this.props.deleteNoteHandler}
          />
        )}

        {this.state.selectedEvent && (
          <EventDrawer
            isOpen
            user={this.props.user}
            onClose={this.closeEventDrawer}
            eventId={this.state.selectedEvent.id}
            submitCallback={this.handleEditEvent}
            deleteCallback={this.handleDeleteEvent}
          />
        )}
      </div>
    )
  }
}
