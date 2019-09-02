import React from 'react'
import { Button } from '@material-ui/core'

import AssociationsDrawer from 'components/AssociationsDrawer'
import { normalizeAssociations } from 'views/utils/association-normalizers'

interface Props {
  registerants: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Registerants({ registerants }: Props) {
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false)

  const count = registerants.length

  return (
    <>
      <Button
        disabled={count === 0}
        onClick={() => setIsOpenDrawer(true)}
        size="small"
      >
        {count}
      </Button>
      {count > 0 && (
        <AssociationsDrawer
          associations={normalizeAssociations(registerants)}
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          title="Registerants"
        />
      )}
    </>
  )
}
