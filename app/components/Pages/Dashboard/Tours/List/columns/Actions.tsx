import React, { useContext, useState } from 'react'
import { Button, Box } from '@material-ui/core'

import { deleteTask } from 'models/tasks/delete-task'

import SplitButton from 'components/SplitButton'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  onEdit: () => void
  onViewToursheet: () => void
  reloadList: () => void
  tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
}

export default function Actions({
  onEdit,
  onViewToursheet,
  reloadList,
  tour
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const confirmation = useContext(ConfirmationModalContext)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteTask(tour.id)
    setIsDeleting(false)
    reloadList()
  }

  const onDelete = e => {
    e.stopPropagation()

    confirmation.setConfirmationModal({
      message: 'Delete Toursheet',
      description: `Are you sure about deleting "${tour.title}"?`,
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
        onClick={onViewToursheet}
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
        View Toursheet
      </SplitButton>
    </Box>
  )
}
