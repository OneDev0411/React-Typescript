import * as React from 'react'

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@material-ui/core'
import { mdiClose, mdiPlus } from '@mdi/js'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import { muiIconSizes } from '@app/views/components/SvgIcons'
import Button from 'components/Button/ActionButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { RoleRow } from './components/RoleRow'
import { permissions } from './permissions'
import { EditTeamRolesTable, EditTeamRolesTableHeader } from './styled'

interface Props {
  close: () => void
  submit: (values: IBrand) => void
  isOpen: boolean
  team: IBrand | null
}

export function EditTeamRolesModal(props: Props) {
  return (
    <Dialog open={props.isOpen} onClose={props.close}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>Edit Roles</div>

          <IconButton color="secondary" size="medium" onClick={props.close}>
            <SvgIcon path={mdiClose} size={muiIconSizes.medium} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Form
        onSubmit={props.submit}
        mutators={{
          ...arrayMutators
        }}
        initialValues={props.team || {}}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} noValidate>
            <DialogContent
              style={{
                padding: 0
              }}
            >
              <EditTeamRolesTable>
                <EditTeamRolesTableHeader>
                  <tr>
                    <th>Permissions</th>
                    {permissions.map(permission => (
                      <th key={permission.value}>{permission.label}</th>
                    ))}
                  </tr>
                </EditTeamRolesTableHeader>
                <tbody>
                  <FieldArray
                    name="roles"
                    render={({ fields }) => {
                      return (
                        <>
                          {fields.map((fieldName, index) => (
                            <RoleRow
                              key={fieldName}
                              onRemove={() => fields.remove(index)}
                              fieldName={fieldName}
                            />
                          ))}

                          <tr>
                            <td>
                              <Button
                                type="button"
                                style={{ paddingLeft: '0' }}
                                appearance="outline"
                                onClick={() =>
                                  fields.push({
                                    role: '',
                                    acl: []
                                  })
                                }
                              >
                                <SvgIcon path={mdiPlus} leftMargined />
                                Add New Role
                              </Button>
                            </td>
                          </tr>
                        </>
                      )
                    }}
                  />
                </tbody>
              </EditTeamRolesTable>
            </DialogContent>
            <DialogActions>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogActions>
          </form>
        )}
      />
    </Dialog>
  )
}
