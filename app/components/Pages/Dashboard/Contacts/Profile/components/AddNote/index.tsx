import { useState } from 'react'

import { Button } from '@material-ui/core'
import { connect } from 'react-redux'

import AddOrEditNoteDrawer from 'components/AddOrEditNoteDrawer/AddOrEditNoteDrawer'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { IAppState } from 'reducers'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

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
        variant="contained"
        color="primary"
        onClick={toggleDrawer}
        size="small"
        data-tour-id="add-note-button"
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
