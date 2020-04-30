import React from 'react'
import _ from 'underscore'

import { setTime } from 'utils/set-time'
import { months } from 'utils/date-times/months'
import { EventDrawer } from 'components/EventDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import Loading from 'components/LoadingContainer'

import { Card } from './styled'
import { TourItem } from './TourItem'
import { EventItem } from './EventItem'
import AutoEmailItem from './AutoEmailItem'
import { OpenHouseItem } from './OpenHouseItem'
import { EmptyState } from './EmptyState'
import { Container, Title } from './styled'

export class Timeline extends React.Component {
  state = {
    selectedEvent: null
  }

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

  get events() {
    const todayEvents = []
    const upcomingEvents = []
    const pastEventsIndexedInMonths = {}

    this.props.items.forEach(item => {
      let date
      let { due_date } = item

      function getDateMonthAndYear(date) {
        date = new Date(date)

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

        if (isToday(due_date)) {
          return todayEvents.push(item)
        }

        if (due_date > new Date().getTime()) {
          return upcomingEvents.push(item)
        }

        date = new Date(due_date)
      } else {
        const createdAt = item.created_at * 1000

        if (isToday(createdAt)) {
          return todayEvents.push(item)
        }

        date = new Date(createdAt)
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

    let pastEvents = []

    if (Object.keys(pastEventsIndexedInMonths).length > 0) {
      pastEvents = Object.keys(pastEventsIndexedInMonths).sort((a, b) => {
        const [aMonth, aYear] = a.split('_')
        const [bMonth, bYear] = b.split('_')

        if (aYear === bYear) {
          return bMonth - aMonth
        }

        return bYear - aYear
      })
    }

    return {
      pastEvents,
      pastEventsIndexedInMonths,
      todayEvents,
      upcomingEvents
    }
  }

  sort = items =>
    _.sortBy(items, item =>
      item.due_date == null ? -item.created_at : -item.due_date
    )

  renderCRMTaskItem(key, task) {
    const _props = {
      defaultAssociation: this.props.defaultAssociation,
      editCallback: this.props.editEventHandler,
      key,
      onClick: this.onClickEvent,
      task
    }

    switch (task.task_type) {
      case 'Tour':
        return <TourItem {..._props} />
      case 'Open House':
        return <OpenHouseItem {..._props} />
      default:
        return <EventItem {..._props} />
    }
  }

  renderItems = month => (
    <React.Fragment>
      <Title>
        <b>{month.title}</b>
      </Title>
      <Card data-test="crm-timeline-card">
        {month.items.map(activity => {
          const key = `timeline_item_${activity.id}`

          if (activity.type === 'crm_task') {
            return this.renderCRMTaskItem(key, activity)
          }

          if (activity.type === 'email_campaign') {
            return (
              <AutoEmailItem
                email={activity}
                key={key}
                onUpdate={this.props.editEventHandler}
              />
            )
          }
        })}
      </Card>
    </React.Fragment>
  )

  renderCRMTaskItemsDrawer() {
    const { selectedEvent } = this.state

    if (!selectedEvent) {
      return null
    }

    const _props = {
      defaultAssociation: this.props.defaultAssociation,
      deleteCallback: this.handleDeleteEvent,
      isOpen: true,
      onClose: this.closeEventDrawer,
      submitCallback: this.handleEditEvent,
      user: this.props.user
    }

    const { id } = selectedEvent

    switch (selectedEvent.task_type) {
      case 'Tour':
        return <TourDrawer {..._props} tourId={id} />
      case 'Open House':
        return <OpenHouseDrawer {..._props} openHouseId={id} />
      default:
        return <EventDrawer {..._props} eventId={id} />
    }
  }

  render() {
    if (this.props.isFetching) {
      return <Loading />
    }

    if (this.props.items.length === 0) {
      return <EmptyState />
    }

    const {
      pastEvents,
      pastEventsIndexedInMonths,
      todayEvents,
      upcomingEvents
    } = this.events

    return (
      <div>
        {upcomingEvents.length > 0 && (
          <Container id="upcoming_events" key="upcoming_events">
            {this.renderItems({
              title: 'Upcoming Events',
              items: this.sort(upcomingEvents)
            })}
          </Container>
        )}

        {todayEvents.length > 0 && (
          <Container id="today_events" key="today_events">
            {this.renderItems({
              title: 'Today Events',
              items: this.sort(todayEvents)
            })}
          </Container>
        )}

        {pastEvents.length > 0 &&
          pastEvents.map(monthIndex => {
            const month = pastEventsIndexedInMonths[monthIndex]
            const id = month.title.replace(' ', '_')

            return (
              <Container id={id} key={`past_events_${id}`}>
                {this.renderItems({
                  title: month.title,
                  items: this.sort(month.items)
                })}
              </Container>
            )
          })}

        {this.renderCRMTaskItemsDrawer()}
      </div>
    )
  }
}

function isToday(date) {
  return setTime(new Date(date)).getTime() === setTime(new Date()).getTime()
}
