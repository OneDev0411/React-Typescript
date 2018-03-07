import React from 'react'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import _ from 'underscore'
import TimelineItem from './item'
import * as userActions from './userActionsHelper'
import Loading from '../../../../../Partials/Loading'
import {
  isFetchingContactActivities,
  selectContactActivitiesError
} from '../../../../../../reducers/contacts/activities'

class Timeline extends React.Component {
  getAttributes(activity) {
    const { name } = this.props
    const actionFn = userActions[activity.action]
    const attributes = actionFn ? actionFn(activity, name) : {}

    return {
      ...attributes,
      ...{ time: timeago().format(activity.created_at * 1000) }
    }
  }

  render() {
    const { activities, name, avatar, isFetching, activitiesError } = this.props

    if (isFetching) {
      return <Loading />
    }

    if (activitiesError) {
      return (
        <div className="no-activity">
          <p>{activitiesError.message}</p>
        </div>
      )
    }

    if (_.size(activities) === 0) {
      return (
        <div className="no-activity">
          <img src="/static/images/contacts/activity.svg" alt="timeline" />
          <p>{name} has no activity right now</p>
        </div>
      )
    }

    return (
      <div>
        {_.map(activities, (activity, id) => {
          const { object } = activity

          if (object && _.size(activity.object) > 0) {
            return (
              <TimelineItem
                key={`timeline_item_${id}`}
                attributes={this.getAttributes(activity)}
                name={name}
                avatar={avatar}
              />
            )
          }
        })}
      </div>
    )
  }
}

const mapStateToProps = ({ contacts: { activities } }) => ({
  isFetching: isFetchingContactActivities(activities),
  activitiesError: selectContactActivitiesError(activities)
})

export default connect(mapStateToProps)(Timeline)
