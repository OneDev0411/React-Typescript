import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import AssociationsDrawer from 'components/AssociationsDrawer'
import { normalizeAssociations } from 'views/utils/association-normalizers'

interface Props {
  registerants: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Registrants({ registerants }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const count = registerants.length

  return (
    <>
      <Button
        disabled={count === 0}
        onClick={() => setIsDrawerOpen(true)}
        size="small"
      >
        {count}
      </Button>
      {count > 0 && (
        <AssociationsDrawer
          associations={normalizeAssociations(registerants)}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Registerants"
        />
      )}
    </>
  )
}
