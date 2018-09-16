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
import { EmptyState } from './EmptyState'

class Timeline extends React.Component {
  componentDidMount() {
    const { contact } = this.props

    if (contact && !contact.activities) {
      this.props.getContactActivities(contact.id)
    }
  }

  render() {
    const { contact } = this.props

    if (this.props.isFetching) {
      return <Loading />
    }

    if (_.size(contact.activities) === 0) {
      return <EmptyState />
    }

    return (
      <div>
        <Title>
          <b>Upcoming Events</b>
        </Title>
        <Card>
          {_.map(contact.activities, activity => {
            const key = `timeline_item_${activity.id}`

            if (activity.type === 'crm_task') {
              return <CRMTaskItem contact={contact} key={key} task={activity} />
            }
          })}
        </Card>
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
