import React, { useContext, useState } from 'react'
import {
  Typography,
  Menu,
  MenuItem,
  IconButton,
  useTheme
} from '@material-ui/core'

import { mdiDotsHorizontal } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { deleteTask } from 'models/tasks/delete-task'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  onEdit: () => void
  reloadList: () => void
  tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
}

export default function Actions({ onEdit, reloadList, tour }: Props) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const confirmation = useContext(ConfirmationModalContext)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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
    <>
      <IconButton onClick={handleMenuClick}>
        <SvgIcon path={mdiDotsHorizontal} color={theme.palette.common.black} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={onEdit} disabled={isDeleting}>
          Edit
        </MenuItem>
        <MenuItem onClick={onDelete} disabled={isDeleting}>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
