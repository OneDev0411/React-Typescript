import { useState, useMemo } from 'react'

import { Box, Typography, Tooltip, IconButton, Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { mdiPencilOutline } from '@mdi/js'
import fecha from 'fecha'
import produce from 'immer'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

import AddOrEditNoteDrawer from 'components/AddOrEditNoteDrawer/AddOrEditNoteDrawer'
import SanitizedHtml from 'components/SanitizedHtml'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { deleteAttribute } from 'models/contacts/delete-attribute'
import { getNotes } from 'models/contacts/helpers/get-notes'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'

import { useStyles } from './styles'

interface Props {
  contact: IContact
  onChange: (contact: IContact) => void
}

export function Notes(props: Props) {
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const [selectedNote, setSelectedNote] = useState(undefined)
  const notes = useMemo(() => getNotes(props.contact), [props.contact])

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

  if (Array.isArray(notes) && notes.length === 0) {
    return (
      <Box className={classes.zeroState}>
        <img
          src="/static/images/contacts/notes-zero-state.svg"
          alt="houston"
          style={{ marginBottom: '1rem' }}
        />
        <Typography variant="subtitle1">
          There are no notes, write your first one.
        </Typography>
      </Box>
    )
  }

  const noteGroups = groupBy(notes, note =>
    fecha.format(new Date(note.created_at * 1000), 'YYYY-MM-DD')
  )

  return (
    <>
      {map(noteGroups, (group, date) => {
        /*
        we're adding this because the {date} value is just date, sth like 2021-01-09
        not time so the Date class will parse the value in UTC (GMT) at midnight
        which cause 1 day off, so we need to add time like this
        */
        const header = fecha.format(new Date(`${date}T00:00:00`), 'D MMM, ddd')

        return (
          <Box display="flex" className={classes.section} key={date}>
            <div className={classes.header}>{header}</div>
            <Box flexGrow={1} className={classes.container}>
              {group.map((note, index) => (
                <Box
                  key={index}
                  display="flex"
                  className={classes.row}
                  onClick={() => setSelectedNote(note)}
                >
                  <Box display="flex">
                    <div className={classes.time}>
                      {fecha
                        .format(new Date(note.created_at * 1000), 'hh:mmA')
                        .toLowerCase()}
                    </div>

                    <SanitizedHtml html={note.text} />
                  </Box>

                  <div className={classes.actions}>
                    <IconButton onClick={() => setSelectedNote(note)}>
                      <Tooltip title="Edit Note" placement="top">
                        <SvgIcon
                          path={mdiPencilOutline}
                          color={theme.palette.grey[500]}
                        />
                      </Tooltip>
                    </IconButton>
                  </div>
                </Box>
              ))}
            </Box>
          </Box>
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
