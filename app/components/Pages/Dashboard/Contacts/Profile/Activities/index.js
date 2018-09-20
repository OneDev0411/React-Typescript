import React from 'react'
import { connect } from 'react-redux'

import Loading from '../../../../../Partials/Loading'
import {
  isFetchingContactActivities,
  selectContactActivitiesError
} from '../../../../../../reducers/contacts/activities'
import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers/get-attribute-from-summary'
import { getContactActivities } from '../../../../../../store_actions/contacts'

// import { getNotes } from '../../../../../../models/contacts/helpers/get-notes'
// import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import { Card } from '../styled'
import { Title } from './styled'

class ActivitiyLog extends React.Component {
  componentDidMount() {
    const { getContactActivities, contact } = this.props

    if (contact && !contact.activities) {
      getContactActivities(contact.id)
    }
  }

  getAttributes = (name, activity) => {
    const actionFn = userActions[activity.action]
    const attributes = actionFn ? actionFn(activity, name) : {}

    return {
      ...attributes,
      time: timeago().format(activity.created_at * 1000)
    }
  }

  render() {
    let name
    let avatar
    let activities = {}
    const { contact, isFetching, activitiesError } = this.props

    if (contact) {
      name = getAttributeFromSummary(contact, 'display_name')
      avatar = getAttributeFromSummary(contact, 'profile_image_url')
      activities = contact.activities
    }

    if (isFetching) {
      return <Loading />
    }

    if (activitiesError) {
      return (
        <div className="empty-list">
          <p>{activitiesError.message}</p>
        </div>
      )
    }

    if (_.size(activities) === 0) {
      return (
        <div className="empty-list">
          <img src="/static/images/contacts/activity.svg" alt="timeline" />
          <p>{name} has no activity right now</p>
        </div>
      )
    }

    return (
      <div>
        <Title>
          <b>Upcoming Events</b>
        </Title>
        <Card>{}</Card>
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
