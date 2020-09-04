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
  openHouse: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  reloadList: () => void
}

export default function Actions({ onEdit, openHouse, reloadList }: Props) {
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

  const handleEdit = () => {
    handleClose()
    onEdit()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteTask(openHouse.id)
    setIsDeleting(false)
    reloadList()
  }

  const onDelete = e => {
    e.stopPropagation()
    handleClose()

    if (isDeleting) {
      return
    }

    confirmation.setConfirmationModal({
      message: 'Delete Open House',
      description: `Are you sure about deleting "${openHouse.title}"?`,
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
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={onDelete}>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
