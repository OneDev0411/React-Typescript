import { useState } from 'react'

import { Button } from '@material-ui/core'

import DealRoleModal from '@app/views/components/DealRole'

interface Props {
  onCreateRole: (role: IDealRole) => void
}

export function CreateRole({ onCreateRole }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <Button variant="outlined" onClick={() => setIsFormOpen(true)}>
        Add Contact
      </Button>

      <DealRoleModal
        isOpen={isFormOpen}
        hideNewContactButton
        onUpsertRole={onCreateRole}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  )
}
