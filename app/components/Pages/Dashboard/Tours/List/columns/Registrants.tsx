import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import AssociationsDrawer from 'components/AssociationsDrawer'
import { normalizeAssociations } from 'views/utils/association-normalizers'

interface Props {
  registrants: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Registrants({ registrants }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const count = registrants.length

  return (
    <>
      <Button
        color="primary"
        disabled={count === 0}
        onClick={() => setIsDrawerOpen(true)}
        size="small"
      >
        {count}
      </Button>
      {count > 0 && (
        <AssociationsDrawer
          associations={normalizeAssociations(registrants)}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Registrants"
        />
      )}
    </>
  )
}
