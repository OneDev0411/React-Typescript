import { useMemo, useState } from 'react'

import { Button } from '@material-ui/core'

import { useBrandPropertyTypeRoles } from '@app/hooks/use-brand-property-type-roles'
import DealRoleModal from '@app/views/components/DealRole'

interface Props {
  checklist: IBrandChecklist
  propertyType?: IDealPropertyType
  onCreateRole: (role: IDealRole) => void
}

export function CreateRole({ checklist, propertyType, onCreateRole }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { roles } = useBrandPropertyTypeRoles(propertyType?.label)

  const allowedRoles = useMemo(() => {
    return roles
      .filter(
        role =>
          role?.checklist_types.includes(checklist.checklist_type) ?? false
      )
      .map(item => item.role)
  }, [roles, checklist.checklist_type])

  return (
    <>
      <Button variant="outlined" onClick={() => setIsFormOpen(true)}>
        Add Contact
      </Button>

      <DealRoleModal
        isOpen={isFormOpen}
        propertyType={propertyType}
        allowedRoles={allowedRoles}
        hideNewContactButton
        onUpsertRole={onCreateRole}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  )
}
