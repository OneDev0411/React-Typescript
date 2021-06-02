import { useState } from 'react'
import { Box, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import ShowingRoleListColumnPerson from './ShowingRoleListColumnPerson'
import ShowingRoleListColumnActions, {
  ShowingRoleListColumnActionsProps
} from './ShowingRoleListColumnActions'
import ShowingRoleListColumnMediums from './ShowingRoleListColumnMediums'
import ShowingRoleFormDialog, {
  ShowingRoleFormValues
} from './ShowingRoleFormDialog'

interface ShowingRoleListProps
  extends Pick<ShowingRoleListColumnActionsProps, 'isHipPocket'> {
  value: IShowingRole[]
  onChange: (value: IShowingRole[]) => void
}

function ShowingRoleList({
  isHipPocket,
  value: roles,
  onChange
}: ShowingRoleListProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)

  const openAddDialog = () => setIsAddOpen(true)

  const closeAddDialog = () => setIsAddOpen(false)

  const handleAdd = (role: ShowingRoleFormValues) => {
    // TODO: add the role at the end of the roles list
    console.log('handleAdd::role', role)
    onChange(roles)
  }

  const handleEdit = (updatedRole: IShowingRole) => {
    const roleIndex = roles.findIndex(role => role.id === updatedRole.id)

    if (roleIndex === -1) {
      return
    }

    const newRoles = [...roles]

    newRoles.splice(roleIndex, 1, updatedRole)

    onChange(newRoles)
  }

  const columns: TableColumn<IShowingRole>[] = [
    {
      id: 'contact',
      width: '40%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnPerson
          name={`${row.first_name} ${row.last_name}`.trim()}
          role={row.role}
          phone={row.phone_number}
          email={row.email}
        />
      )
    },
    {
      id: 'confirm_notification_type',
      width: '20%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnMediums
          label="Confirm by"
          types={row.confirm_notification_type}
        />
      )
    },
    {
      id: 'cancel_notification_type',
      width: '20%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnMediums
          label="Notify On"
          types={row.cancel_notification_type}
        />
      )
    },
    {
      id: 'body-actions',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <ShowingRoleListColumnActions
          isHipPocket={isHipPocket}
          role={row}
          hideRoles={roles
            .filter(role => role.id !== row.id)
            .map(role => role.role)}
          onEdit={handleEdit}
        />
      )
    }
  ]

  return (
    <div>
      <Table
        rows={roles}
        totalRows={roles.length}
        columns={columns}
        virtualize={false}
      />
      <Box mt={2}>
        <Button
          size="small"
          variant="outlined"
          color="default"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
        >
          Add New Participants
        </Button>
      </Box>
      <ShowingRoleFormDialog
        title="Add New Participant"
        open={isAddOpen}
        onClose={closeAddDialog}
        hideRoles={roles.map(role => role.role)}
        onConfirm={handleAdd}
      />
    </div>
  )
}

export default ShowingRoleList
