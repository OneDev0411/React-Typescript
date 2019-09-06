import React, { useContext, useState } from 'react'
import { Button, Box } from '@material-ui/core'

import { deleteTask } from 'models/tasks/delete-task'

import SplitButton from 'components/SplitButton'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import config from '../../../../../../../config/public'

interface Props {
  activeBrandId: UUID
  onEdit: () => void
  openHouse: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  reloadList: () => void
}

export default function Actions({
  activeBrandId,
  onEdit,
  openHouse,
  reloadList
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const confirmation = useContext(ConfirmationModalContext)
  const registerPageURL = `${config.app.url}/openhouse/${
    openHouse.id
  }/${activeBrandId}/register`

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteTask(openHouse.id)
    setIsDeleting(false)
    reloadList()
  }

  const onDelete = e => {
    e.stopPropagation()

    confirmation.setConfirmationModal({
      message: 'Delete Open House',
      description: `Are you sure about deleting "${openHouse.title}"?`,
      confirmLabel: 'Yes, I am sure',
      onConfirm: () => handleDelete()
    })
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <SplitButton
        color="secondary"
        variant="outlined"
        popperPlacement="bottom-end"
        onClick={() => window.open(registerPageURL)}
        renderMenu={() => (
          <>
            <Button fullWidth onClick={onEdit}>
              Edit
            </Button>
            <Button disabled={isDeleting} fullWidth onClick={onDelete}>
              Delete
            </Button>
          </>
        )}
      >
        Guest Registration Page
      </SplitButton>
    </Box>
  )
}
