import { Form } from 'react-final-form'

import * as React from 'react'

import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'

import { Modal, ModalFooter, ModalHeader } from 'components/Modal'

import Button from 'components/Button/ActionButton'
import AddIcon from 'components/SvgIcons/Add/AddIcon'

import { ITeam } from 'models/BrandConsole/types'

import { EditTeamRolesTable, EditTeamRolesTableHeader } from './styled'
import { RoleRow } from './components/RoleRow'
import { permissions } from './permissions'

interface Props {
  close: () => void
  submit: (values: any) => void
  isOpen: boolean
  team: ITeam | null
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
                              <AddIcon style={{ margin: '0 0.3rem' }} />
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
