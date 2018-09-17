import React from 'react'

import Loading from '../../../../../Partials/Loading'
import { EditNoteDrawer } from '../../../../../../views/components/EditNoteDrawer'
import { EditEventDrawer } from '../../../../../../views/components/EditEventDrawer'

import { Card } from '../styled'
import { NoteItem } from './NoteItem'
import CRMTaskItem from './TaskItem'
import { Title } from '../Timeline/styled'
import { EmptyState } from './EmptyState'

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

  render() {
    if (this.props.isFetching) {
      return <Loading />
    }

    if (this.props.items.length > 0) {
      return (
        <div>
          <Title>
            <b>Upcoming Events</b>
          </Title>
          <Card>
            {this.props.items.map(activity => {
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
            <EditEventDrawer
              isOpen={this.state.showEditEventDrawer}
              eventId={this.state.selectedEvent.id}
              onClose={this.closeEditEventDrawer}
              onSubmit={this.props.editEventHandler}
            />
          )}
        </div>
      )
    }

    return <EmptyState />
  }
}
