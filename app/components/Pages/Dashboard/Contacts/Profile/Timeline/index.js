import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import CRMTaskItem from './TaskItem'
import Loading from '../../../../../Partials/Loading'
import {
  isFetchingContactActivities,
  selectContactActivitiesError
} from '../../../../../../reducers/contacts/activities'
import { getContactActivities } from '../../../../../../store_actions/contacts'

import { Card } from '../styled'
import { Title } from '../Timeline/styled'

class Timeline extends React.Component {
  componentDidMount() {
    const { contact } = this.props

    if (contact && !contact.activities) {
      this.props.getContactActivities(contact.id)
    }
  }

  render() {
    let content
    let activities = {}
    const { contact, isFetching, activitiesError } = this.props

    if (contact) {
      activities = contact.activities
    }

    if (activitiesError) {
      content = (
        <div className="empty-list">
          <p>{activitiesError.message}</p>
        </div>
      )
    }

    if (_.size(activities) === 0) {
      content = (
        <div className="empty-list">
          <img src="/static/images/contacts/activity.svg" alt="timeline" />
          <p>no activity right now</p>
        </div>
      )
    }

    content = _.map(activities, activity => {
      const key = `timeline_item_${activity.id}`

      if (activity.type === 'crm_task') {
        return <CRMTaskItem contact={contact} key={key} task={activity} />
      }
    })

    return (
      <div>
        <Title>
          <b>Upcoming Events</b>
        </Title>
        <Card style={{ padding: 0 }}>{isFetching ? <Loading /> : content}</Card>
      </div>
    )
  }
}

const mapStateToProps = ({ contacts: { activities } }) => ({
  isFetching: isFetchingContactActivities(activities),
  activitiesError: selectContactActivitiesError(activities)
})

export default connect(
  mapStateToProps,
  {
    getContactActivities
  }
)(Timeline)
