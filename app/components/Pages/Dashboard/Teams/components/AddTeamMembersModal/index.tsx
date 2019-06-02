import { Field, Form } from 'react-final-form'

import * as React from 'react'

import Flex from 'styled-flex-component'

import { Modal, ModalHeader } from 'components/Modal'

import { MultipleContactsSelect } from 'components/Forms/MultipleContactsSelect'
import { ITeam } from 'models/BrandConsole/types'
import { Checkbox } from 'components/Checkbox'
import { Divider } from 'components/Divider'

import { InputError } from 'components/Forms/styled'

import { Button, RolesLabel } from './styled'

interface Props {
  close: () => void
  submit: (values: any) => void
  isOpen: boolean
  team: ITeam | null
}

export function AddTeamMembersModal(props: Props) {
  return (
    <Modal
      style={{ content: { overflow: 'visible' } }}
      isOpen={props.isOpen}
      onRequestClose={props.close}
      autoHeight
    >
      <ModalHeader closeHandler={props.close} title="Add Members" />
      <Form
        onSubmit={props.submit}
        initialValues={{ members: [], roles: [] }}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '0.5rem 1.5rem' }}>
              <Field
                placeholder="Enter an email"
                suggestTagsAndLists={false}
                isRequired
                required
                validate={value =>
                  value.length === 0 &&
                  'At least one user or email should be selected'
                }
                hasLabel={false}
                name="members"
                component={MultipleContactsSelect}
              />
              <Divider margin="0 0 1rem 0" />
              <Field
                name="roles"
                validate={value =>
                  value.length === 0 && 'At least one role should be selected'
                }
                render={({ input, meta }) => {
                  const toggle = roleId => {
                    const newValue = input.value.includes(roleId)
                      ? input.value.filter(item => item !== roleId)
                      : [...input.value, roleId]

                    input.onChange(newValue)
                  }

                  const roles = (props.team && props.team.roles) || []

                  return (
                    roles.length && (
                      <>
                        <div>
                          <RolesLabel>Roles</RolesLabel>
                          {roles.map(role => (
                            <Checkbox
                              containerStyle={{ marginRight: '1.5rem' }}
                              key={role.id}
                              onChange={() => toggle(role.id)}
                              checked={input.value.includes(role.id)}
                            >
                              {role.role}
                            </Checkbox>
                          ))}
                        </div>
                        {meta.error && meta.touched && (
                          <InputError display={meta.touched}>
                            {meta.error}
                          </InputError>
                        )}
                      </>
                    )
                  )
                }}
              />
            </div>
            <Flex justifyEnd style={{ padding: '1.5rem' }}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add'}
              </Button>
            </Flex>
          </form>
        )}
      />
    </Modal>
  )
}
