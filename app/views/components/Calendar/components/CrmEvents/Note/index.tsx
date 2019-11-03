import React from 'react'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'

import { EditNoteDrawer } from 'components/EditNoteDrawer'

interface Props {
  event: ICalendarEvent
  onCloseEventDrawer(): void
  onChange(event: IEvent, type: string): void
}

const noteEventType = {
  task_type: 'Note',
  type: 'crm_association'
}

export function Note(props: Props) {
  const handleUpdateNote = async note => {
    const contact = props.event!.people![0]

    try {
      await upsertContactAttributes(contact.id, [
        {
          id: note.id,
          text: note.text
        }
      ])

      props.onChange(
        {
          ...props.event,
          ...noteEventType,
          contact,
          associations: [
            {
              association_type: 'contact',
              contact
            }
          ] as TaskAssociation[],
          due_date: props.event.timestamp,
          title: note.text
        } as any,
        'updated'
      )
    } catch (e) {}
  }

  const handleDeleteNote = async note => {
    const contact = props.event!.people![0]

    try {
      await deleteAttribute(contact.id, note.id)

      props.onChange(
        {
          ...props.event,
          ...noteEventType
        } as any,
        'deleted'
      )
    } catch (e) {}
  }

  return (
    <EditNoteDrawer
      isOpen
      note={{
        ...props.event,
        id: props.event.id,
        text: props.event.title
      }}
      onClose={props.onCloseEventDrawer}
      onSubmit={handleUpdateNote}
      onDelete={handleDeleteNote}
    />
  )
}
