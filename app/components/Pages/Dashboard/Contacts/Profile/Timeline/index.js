import React from 'react'

import Loading from '../../../../../Partials/Loading'
import { EditNoteDrawer } from '../../../../../../views/components/EditNoteDrawer'
import { EventDrawer } from '../../../../../../views/components/EventDrawer'

import { Card } from '../styled'
import { NoteItem } from './NoteItem'
import CRMTaskItem from './TaskItem'
import { EmptyState } from './EmptyState'
import { Container, Title } from './styled'

export class Timeline extends React.Component {
  state = {
    selectedNote: null,
    selectedEvent: null,
    showEditNoteDrawer: false,
    showEditEventDrawer: false
  }

  openEditNoteDrawer = selectedNote =>
    this.setState({ showEditNoteDrawer: true, selectedNote })
  closeEditNoteDrawer = () =>
    this.setState({ showEditNoteDrawer: false, selectedNote: null })

  openEditEventDrawer = selectedEvent =>
    this.setState({ showEditEventDrawer: true, selectedEvent })
  closeEditEventDrawer = () =>
    this.setState({ showEditEventDrawer: false, selectedEvent: null })

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
                onClick={this.openEditEventDrawer}
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
                onClick={this.openEditNoteDrawer}
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
              items: upcomingEvents
            })}
          </Container>
        )}

        {sortedPastEvents.length > 0 &&
          sortedPastEvents.map(monthIndex => {
            const month = pastEventsIndexedInMonths[monthIndex]
            const id = month.title.replace(' ', '_')

            return (
              <Container id={id} key={`past_events_${id}`}>
                {this.renderItems(month)}
              </Container>
            )
          })}

        {this.state.selectedNote && (
          <EditNoteDrawer
            isOpen={this.state.showEditNoteDrawer}
            note={this.state.selectedNote}
            onClose={this.closeEditNoteDrawer}
            onSubmit={this.props.editNoteHandler}
            onDelete={this.props.deleteNoteHandler}
          />
        )}

        {this.state.selectedEvent && (
          <EventDrawer
            title="Edit Event"
            isOpen={this.state.showEditEventDrawer}
            eventId={this.state.selectedEvent.id}
            onClose={this.closeEditEventDrawer}
            onSubmit={this.props.editEventHandler}
          />
        )}
      </div>
    )
  }
}
