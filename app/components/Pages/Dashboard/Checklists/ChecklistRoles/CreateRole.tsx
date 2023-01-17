import { useMemo, useState } from 'react'

import { Button } from '@material-ui/core'

import DealRoleModal from '@app/views/components/DealRole'

interface Props {
  checklist: IBrandChecklist
  propertyTypeId: UUID
  propertyTypes?: IDealPropertyType[]
  onCreateRole: (role: IDealRole) => void
}

export function CreateRole({
  checklist,
  propertyTypes,
  propertyTypeId,
  onCreateRole
}: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { propertyType, roles } = useMemo(() => {
    const propertyType = propertyTypes?.find(({ id }) => id === propertyTypeId)
    const roles = [
      ...(propertyType?.required_roles || []),
      ...(propertyType?.optional_roles || [])
    ]

    return { propertyType, roles }
  }, [propertyTypeId, propertyTypes])

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

      {isFormOpen && (
        <DealRoleModal
          isOpen
          propertyType={propertyType}
          allowedRoles={allowedRoles}
          hideNewContactButton
          onUpsertRole={onCreateRole}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  )
}
