import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Button } from '@material-ui/core'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'

import { IAppState } from 'reducers'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import AddOrEditNoteDrawer from 'components/AddOrEditNoteDrawer/AddOrEditNoteDrawer'

interface StateProps {
  attributeDefs: any
}

interface Props {
  contactId: UUID
  onCreateNote(contact: IContact): void
}

function AddNote({
  contactId,
  attributeDefs,
  onCreateNote
}: Props & StateProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)

  const handleCreateNote = async ({ text }) => {
    try {
      const contact = await upsertContactAttributes(contactId, [
        {
          text,
          attribute_def: selectDefinitionByName(attributeDefs, 'note')
        }
      ])

      // callback
      onCreateNote(contact)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        size="small"
        onClick={toggleDrawer}
      >
        Add Note
      </Button>

      <AddOrEditNoteDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        onSubmit={handleCreateNote}
      />
    </>
  )
}

const mapStateToProps = ({ contacts }: IAppState) => {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(AddNote)
