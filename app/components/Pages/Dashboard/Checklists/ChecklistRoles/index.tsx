import { Box, Typography } from '@material-ui/core'

import { CreateRole } from './CreateRole'
import { ChecklistRolesTable } from './RolesTable'

interface Props {
  checklist: IBrandChecklist
  onCreateRole: (role: IDealRole) => void
  onUpdateRole: (role: IDealRole) => void
  onDeleteRole: (roleId: UUID) => void
  onReorderRoles: (roles: IDealRole[]) => void
}

export function ChecklistRoles({
  checklist,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
  onReorderRoles
}: Props) {
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Contacts</Typography>
        <CreateRole onCreateRole={onCreateRole} />
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
