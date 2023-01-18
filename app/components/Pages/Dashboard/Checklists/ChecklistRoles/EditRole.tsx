import { useState } from 'react'

import DealRoleModal from '@app/views/components/DealRole'

interface Props {
  children: React.ReactNode
  role: IBrandChecklistRole
  onUpdateRole: (role: IBrandChecklistRole) => void
}

export function EditRole({ children, role, onUpdateRole }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsFormOpen(true)}>{children}</div>

      {isFormOpen && (
        <DealRoleModal
          isOpen
          form={role}
          hideNewContactButton
          onUpsertRole={(data: IDealRole) =>
            onUpdateRole({
              ...data,
              order: role.order
            })
          }
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  )
}
