import React, { useState, Fragment } from 'react'
import { makeStyles, Tooltip } from '@material-ui/core'
import produce from 'immer'

import cn from 'classnames'
import fecha from 'fecha'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'
import { getNotes } from 'models/contacts/helpers/get-notes'
import { useIconStyles } from 'views/../styles/use-icon-styles'

import SanitizedHtml from 'components/SanitizedHtml'
import { EditNoteDrawer } from 'components/EditNoteDrawer'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import IconNote from 'components/SvgIcons/Note/IconNote'

import { styles } from './styles'

interface Props {
  contact: IContact
  onChange: (contact: IContact) => void
}

export const useStyles = makeStyles(styles)

export function Notes(props: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const [selectedNote, setSelectedNote] = useState(null)

  const handleUpdateNote = async note => {
    try {
      const contact = await upsertContactAttributes(props.contact.id, [
        {
          id: note.id,
          text: note.text
        }
      ])

      props.onChange(contact)
    } catch (e) { }
  }

  const handleDeleteNote = async note => {
    try {
      await deleteAttribute(props.contact.id, note.id)

      const newContact = produce(
        props.contact,
        (draft: IContact & { sub_contacts: any }) => {
          Array.isArray(draft.sub_contacts) &&
            draft.sub_contacts.forEach(subContact => {
              subContact.sections.Notes = subContact.sections.Notes.filter(
                item => item.id !== note.id
              )
            })
        }
      )

      props.onChange(newContact)
    } catch (e) {
      console.log(e)
    }
  }

  const noteGroups = groupBy(getNotes(props.contact), note =>
    fecha.format(new Date(note.created_at * 1000), 'YYYY-MM-DD')
  )

  return (
    <>
      {map(noteGroups, (group, date) => (
        <Fragment key={date}>
          <div className={classes.header}>
            {fecha.format(new Date(date), 'dddd, MMMM Do, YYYY')}
          </div>

          {group.map((note, index) => (
            <div
              key={note.id}
              className={cn(classes.root, {
                [classes.dark]: index % 2 === 0
              })}
            >
              <button
                type="button"
                className={classes.buttonContainer}
                onClick={() => setSelectedNote(note)}
              >
                Add
              </button>

              <div className={classes.row}>
                <div className={classes.container}>
                  <div className={classes.time}>
                    {fecha.format(new Date(note.created_at * 1000), 'hh:mm A')}
                  </div>
                  <div className={cn(classes.container, classes.title)}>
                    <div className={classes.iconNote}>
                      <IconNote fill="#6A7589" className={iconClasses.small} />
                    </div>
                    <SanitizedHtml html={note.text} />
                  </div>
                </div>

                <div className={classes.actions}>
                  <Tooltip title="Edit Note" placement="top">
                    <EditIcon
                      className={cn(iconClasses.small, classes.iconEdit)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </Fragment>
      ))}

      {selectedNote && (
        <EditNoteDrawer
          isOpen
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onSubmit={handleUpdateNote}
          onDelete={handleDeleteNote}
        />
      )}
    </>
  )
}
