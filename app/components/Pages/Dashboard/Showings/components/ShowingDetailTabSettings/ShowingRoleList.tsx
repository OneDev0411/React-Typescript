import { useState } from 'react'
import { Box, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import ShowingRoleListColumnPerson from './ShowingRoleListColumnPerson'
import ShowingRoleListColumnActions from './ShowingRoleListColumnActions'
import ShowingRoleListColumnMediums from './ShowingRoleListColumnMediums'
import ShowingRoleFormDialog, {
  ShowingRoleFormValues
} from './ShowingRoleFormDialog'

interface ShowingRoleListProps {
  value: IShowingRole[]
  onChange: (value: IShowingRole[]) => void
}

function ShowingRoleList({ value: roles, onChange }: ShowingRoleListProps) {
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
      width: '25%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnPerson
          name={`${row.first_name} ${row.last_name}`.trim()}
          role={row.role}
        />
      )
    },
    {
      id: 'confirm_notification_type',
      width: '30%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnMediums
          label="Confirm via"
          types={row.confirm_notification_type}
        />
      )
    },
    {
      id: 'cancel_notification_type',
      width: '30%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnMediums
          label="Get Notify On"
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
        hasRoleField
      />
    </div>
  )
}

export default ShowingRoleList
