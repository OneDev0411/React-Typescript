import { useMemo } from 'react'

import { Box, Typography } from '@material-ui/core'

import { CreateRole } from './CreateRole'
import { ChecklistRolesTable } from './RolesTable'

interface Props {
  checklist: IBrandChecklist
  propertyTypeId: UUID
  propertyTypes: IDealPropertyType[]
  onCreateRole: (role: IBrandChecklistRole) => void
  onUpdateRole: (role: IBrandChecklistRole) => void
  onDeleteRole: (roleId: UUID) => void
  onReorderRoles: (roles: IBrandChecklistRole[]) => void
}

export function ChecklistRoles({
  checklist,
  propertyTypeId,
  propertyTypes,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
  onReorderRoles
}: Props) {
  const propertyType = useMemo(
    () => propertyTypes.find(({ id }) => id === propertyTypeId),
    [propertyTypeId, propertyTypes]
  )

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Contacts</Typography>
        <CreateRole
          checklist={checklist}
          propertyType={propertyType}
          onCreateRole={onCreateRole}
        />
      </Box>

      <Box mt={2} mb={4}>
        <ChecklistRolesTable
          checklist={checklist}
          onUpdateRole={onUpdateRole}
          onDeleteRole={onDeleteRole}
          onReorderRoles={onReorderRoles}
        />
      </Box>
    </Box>
  )
}
