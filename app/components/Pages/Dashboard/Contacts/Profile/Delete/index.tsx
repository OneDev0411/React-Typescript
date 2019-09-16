import React, { useContext } from 'react'
import { Box } from '@material-ui/core'

import { red } from 'views/utils/colors'
import { DangerButton } from 'components/Button/DangerButton'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  isDeleting: boolean
  handleDelete: () => Promise<void>
}

export default function Delete(props: Props) {
  const confirmation = useContext(ConfirmationModalContext)

  const onClick = () => {
    confirmation.setConfirmationModal({
      message: 'Delete contact?',
      description:
        'Deleting this contact will remove it from your contacts list, but it will not be removed from any deals.',
      confirmLabel: 'Delete',
      onConfirm: props.handleDelete
    })
  }

  if (props.isDeleting) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10000,
          color: red.primary,
          fontSize: '4rem',
          fontWeight: 'bold',
          opacity: 0.8,
          background: '#ccc'
        }}
      >
        Deleting...
      </div>
    )
  }

  return (
    <Box p={3}>
      <DangerButton fullWidth variant="outlined" onClick={onClick}>
        Delete Contact
      </DangerButton>
    </Box>
  )
}
