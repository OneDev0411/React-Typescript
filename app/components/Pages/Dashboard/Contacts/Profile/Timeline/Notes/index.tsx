import React, { useState, Fragment } from 'react'
import { makeStyles, Tooltip, IconButton, Theme } from '@material-ui/core'
import produce from 'immer'

import cn from 'classnames'
import fecha from 'fecha'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

import { useTheme } from '@material-ui/styles'
import { mdiPencilOutline, mdiNoteTextOutline } from '@mdi/js'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'
import { getNotes } from 'models/contacts/helpers/get-notes'

import SanitizedHtml from 'components/SanitizedHtml'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import AddOrEditNoteDrawer from 'components/AddOrEditNoteDrawer/AddOrEditNoteDrawer'

import { styles } from './styles'

interface Props {
  contact: IContact
  onChange: (contact: IContact) => void
}

export const useStyles = makeStyles(styles)

export function Notes(props: Props) {
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const [selectedNote, setSelectedNote] = useState(undefined)

  const handleUpdateNote = async note => {
    try {
      const contact = await upsertContactAttributes(props.contact.id, [
        {
          id: note.id,
          text: note.text
        }
      ])

      props.onChange(contact)
    } catch (e) {}
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
      {map(noteGroups, (group, date) => {
        /*
        we're adding this because the {date} value is just date, sth lile 2021-01-09
        not time so the Date class will parse the value in UTC (GMT) at midnight
        which cause 1 day off, so we need to add time like this
        */
        const header = fecha.format(
          new Date(`${date}T00:00:00`),
          'dddd, MMMM Do, YYYY'
        )

        return (
          <Fragment key={date}>
            <div className={classes.header}>{header}</div>

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
                  Note
                </button>

                <div className={classes.row}>
                  <div className={classes.container}>
                    <div className={classes.time}>
                      {fecha.format(
                        new Date(note.created_at * 1000),
                        'hh:mm A'
                      )}
                    </div>
                    <div className={cn(classes.container, classes.title)}>
                      <div className={classes.iconNote}>
                        <SvgIcon
                          path={mdiNoteTextOutline}
                          color={theme.palette.grey[600]}
                        />
                      </div>
                      <SanitizedHtml html={note.text} />
                    </div>
                  </div>

                  <div className={classes.actions}>
                    <IconButton onClick={() => setSelectedNote(note)}>
                      <Tooltip title="Edit Note" placement="top">
                        <SvgIcon
                          path={mdiPencilOutline}
                          color={theme.palette.grey[400]}
                        />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        )
      })}

      {selectedNote && (
        <AddOrEditNoteDrawer
          isOpen
          note={selectedNote}
          onClose={() => setSelectedNote(undefined)}
          onSubmit={handleUpdateNote}
          onDelete={handleDeleteNote}
        />
      )}
    </>
  )
}
