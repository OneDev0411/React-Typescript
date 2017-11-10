import React from 'react'
import moment from 'moment'
import _ from 'underscore'
import TimelineItem from './item'
import * as userActions from './userActionsHelper'

export default class Timeline extends React.Component {
  constructor(props) {
    super(props)
  }

  getAttributes(activity) {
    const { name } = this.props
    const actionFn = userActions[activity.action]
    const attributes = actionFn ? actionFn(activity, name) : {}

    return {
      ...attributes,
      ...{ time: moment.unix(activity.created_at).fromNow() }
    }
  }

  render() {
    const { activities, name, avatar } = this.props

    if (_.size(activities) === 0) {
      return (
        <div className="no-activity">
          <img src="/static/images/contacts/activity.svg" />
          <p>{ name } has no activity right now</p>
        </div>
      )
    }

    return (
      <div>
        {
          _.map(activities, (activity, id) =>
            <TimelineItem
              key={`timeline_item_${id}`}
              attributes={this.getAttributes(activity)}
              name={name}
              avatar={avatar}
            />
          )
        }
      </div>
    )
  }
}
