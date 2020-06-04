import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import Drawer from 'components/OverlayDrawer'

import DuplicateContactsList from '../DuplicateContactsList'

interface Props {
  title: string
  contacts: IContact[]
  masterId: UUID
  onDismissClick: React.ComponentProps<
    typeof DuplicateContactsList
  >['onDismissClick']
  onSetMasterClick: React.ComponentProps<
    typeof DuplicateContactsList
  >['onSetMasterClick']
  onMergeClick: () => Promise<void>
  onClose: () => void
}

export default function DuplicateContactsDrawer({
  title,
  contacts,
  masterId,
  onClose,
  onDismissClick,
  onSetMasterClick,
  onMergeClick
}: Props) {
  const [isMerging, setIsMerging] = useState(false)

  const handleClose = () => {
    onClose()
  }

  const handleMergeClick = async () => {
    setIsMerging(true)
    await onMergeClick()
    setIsMerging(false)
  }

  return (
    <Drawer open onClose={handleClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        <DuplicateContactsList
          contacts={contacts}
          masterId={masterId}
          onDismissClick={onDismissClick}
          onSetMasterClick={onSetMasterClick}
        />
      </Drawer.Body>
      <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
        <Button
          disabled={isMerging}
          variant="contained"
          color="primary"
          onClick={handleMergeClick}
        >
          {isMerging ? 'Merging...' : 'Merge'}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
