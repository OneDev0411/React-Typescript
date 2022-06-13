import { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import { connect } from 'react-redux'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
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
        color="primary"
        variant="contained"
        onClick={toggleDrawer}
        data-tour-id="add-note-button"
        startIcon={<SvgIcon path={mdiPlus} />}
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
