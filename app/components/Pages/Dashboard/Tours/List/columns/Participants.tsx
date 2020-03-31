import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import pluralize from 'pluralize'

import AssociationsDrawer from 'components/AssociationsDrawer'
import { normalizeAssociations } from 'views/utils/association-normalizers'

interface Props {
  participants: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Participants({ participants }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const count = participants.length

  return (
    <>
      <Button
        color="inherit"
        disabled={count === 0}
        onClick={() => setIsDrawerOpen(true)}
        size="small"
      >
        {pluralize('Participant', count, true)}
      </Button>
      {count > 0 && (
        <AssociationsDrawer
          associations={normalizeAssociations(participants)}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Participants"
        />
      )}
    </>
  )
}
