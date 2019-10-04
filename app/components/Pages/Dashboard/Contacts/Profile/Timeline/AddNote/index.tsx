import React, { useState } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'

import { Button } from '@material-ui/core'

import IconNote from 'components/SvgIcons/Note/IconNote'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'

import { IAppState } from 'reducers'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import { EditNoteDrawer } from 'components/EditNoteDrawer'

import { useIconStyles } from '../../../../../../../styles/use-icon-styles'

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
  const iconClasses = useIconStyles()
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
      <Button color="primary" variant="contained" onClick={toggleDrawer}>
        <IconNote
          fillColor="#fff"
          className={cn(iconClasses.small, iconClasses.rightMargin)}
        />
        Add Note
      </Button>

      <EditNoteDrawer
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