import { Form } from 'react-final-form'

import * as React from 'react'

import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { mdiPlus } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Modal, ModalFooter, ModalHeader } from 'components/Modal'

import Button from 'components/Button/ActionButton'

import { EditTeamRolesTable, EditTeamRolesTableHeader } from './styled'
import { RoleRow } from './components/RoleRow'
import { permissions } from './permissions'

interface Props {
  close: () => void
  submit: (values: IBrand) => void
  isOpen: boolean
  team: IBrand | null
}

export function EditTeamRolesModal(props: Props) {
  return (
    <Modal isOpen={props.isOpen} onRequestClose={props.close} autoHeight large>
      <ModalHeader closeHandler={props.close} title="Edit Roles" />
      <Form
        onSubmit={props.submit}
        mutators={{
          ...arrayMutators
        }}
        initialValues={props.team || {}}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} noValidate>
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
            <ModalFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </ModalFooter>
          </form>
        )}
      />
    </Modal>
  )
}
