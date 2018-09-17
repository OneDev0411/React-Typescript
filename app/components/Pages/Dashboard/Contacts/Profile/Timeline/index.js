import React from 'react'

import Loading from '../../../../../Partials/Loading'
import { Card } from '../styled'
import { NoteItem } from './NoteItem'
import CRMTaskItem from './TaskItem'
import { Title } from '../Timeline/styled'
import { EmptyState } from './EmptyState'

export function Timeline(props) {
  if (props.isFetching) {
    return <Loading />
  }

  if (props.items.length > 0) {
    return (
      <div>
        <Title>
          <b>Upcoming Events</b>
        </Title>
        <Card>
          {props.items.map(activity => {
            const key = `timeline_item_${activity.id}`

            if (activity.type === 'crm_task') {
              return (
                <CRMTaskItem
                  contact={props.contact}
                  key={key}
                  task={activity}
                />
              )
            }

            if (
              activity.type === 'contact_attribute' &&
              activity.attribute_type === 'note'
            ) {
              return (
                <NoteItem contact={props.contact} key={key} note={activity} />
              )
            }
          })}
        </Card>
      </div>
    )
  }

  return <EmptyState />
}
