import { useState, ReactNode } from 'react'

import { Box } from '@material-ui/core'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import useAsync from 'hooks/use-async'
import useNotify from 'hooks/use-notify'
import addShowingRole from 'models/showing/add-showing-role'

import { goAndShowNotificationTypes } from '../../constants'
import { getShowingRoleLabel } from '../../helpers'
import ShowingRoleAddNewButton from '../ShowingRoleAddNewButton'
import { ShowingRoleFormDialog } from '../ShowingRoleForm'
import { ShowingRoleFormValues } from '../ShowingRoleForm/types'
import useShowingRoleFormSubmit from '../ShowingRoleForm/use-showing-role-form-submit'

import ShowingRoleListColumnActions, {
  ShowingRoleListColumnActionsProps
} from './ShowingRoleListColumnActions'
import ShowingRoleListColumnMediums from './ShowingRoleListColumnMediums'
import ShowingRoleListColumnPerson from './ShowingRoleListColumnPerson'

export interface ShowingRoleListProps
  extends Pick<
    ShowingRoleListColumnActionsProps,
    'showingId' | 'hasNotificationTypeFields'
  > {
  value: IShowingRole[]
  onChange: (value: IShowingRole[]) => void
  children?: ReactNode
}

function ShowingRoleList({
  showingId,
  value: roles,
  onChange,
  hasNotificationTypeFields,
  children
}: ShowingRoleListProps) {
  const activeBrandId = useActiveBrandId()
  const [addRole, setAddRole] = useState<Nullable<IShowingRoleType>>(null)

  const openAddDialog = (role: IShowingRoleType) => setAddRole(role)

  const closeAddDialog = () => setAddRole(null)

  const { run, isLoading } = useAsync()

  const notify = useNotify()

  const { handleSubmit: handleAdd, isSavingContact } = useShowingRoleFormSubmit(
    ({ save_to_contact, contact, ...role }: ShowingRoleFormValues) => {
      run(async () => {
        const newRole = await addShowingRole(showingId, {
          ...role,
          user: role.user?.id,
          ...(!hasNotificationTypeFields ? goAndShowNotificationTypes : {}),
          brand: activeBrandId
        })

        onChange([...roles, newRole])

        notify({
          status: 'success',
          message: 'A new participant was added successfully.'
        })
      })
    }
  )

  const handleEdit = (updatedRole: IShowingRole) => {
    const roleIndex = roles.findIndex(role => role.id === updatedRole.id)

    if (roleIndex === -1) {
      return
    }

    const newRoles = [...roles]

    newRoles.splice(roleIndex, 1, updatedRole)

    onChange(newRoles)
  }

  const handleDelete = (roleId: UUID) => {
    const roleIndex = roles.findIndex(role => role.id === roleId)

    if (roleIndex === -1) {
      return
    }

    const newRoles = [...roles]

    newRoles.splice(roleIndex, 1)

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
    ...(hasNotificationTypeFields
      ? [
          {
            id: 'confirm_notification_type',
            width: '25%',
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
            width: '25%',
            sortable: false,
            render: ({ row }) => (
              <ShowingRoleListColumnMediums
                label="Get Notify On"
                types={row.cancel_notification_type}
              />
            )
          }
        ]
      : []),

    {
      id: 'body-actions',
      sortable: false,
      align: 'right',
      width: 'auto',
      render: ({ row }) => (
        <ShowingRoleListColumnActions
          role={row}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showingId={showingId}
          hasNotificationTypeFields={hasNotificationTypeFields}
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
      <Box display="flex" justifyContent="space-between" mt={2}>
        <ShowingRoleAddNewButton
          onClick={openAddDialog}
          disabled={isLoading || isSavingContact}
        />
        {children}
      </Box>
      <ShowingRoleFormDialog
        title={`Add ${getShowingRoleLabel(addRole!)} Role`}
        open={!!addRole}
        onClose={closeAddDialog}
        onConfirm={handleAdd}
        initialValues={{
          role: addRole ?? undefined,
          first_name: '',
          last_name: '',
          phone_number: '',
          email: '',
          can_approve: true,
          confirm_notification_type: [],
          cancel_notification_type: [],
          save_to_contact: true
        }}
        hasNotificationTypeFields={hasNotificationTypeFields}
      />
    </div>
  )
}

export default ShowingRoleList
