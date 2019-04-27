import React, { Fragment } from 'react'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import TrashIcon from 'components/SvgIcons/TrashIcon/'

import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import Tooltip from 'components/tooltip'

import { TextInput } from 'components/Forms/TextInput'

import { TitleInput } from './form-components/TitleInput'
import { TypeInput } from './form-components/TypeInput'
import { Roles } from './form-components/Roles'
import { Address } from './form-components/Address'
import { MlsIdInput } from './form-components/MlsIdInput'
import { NameInput } from './form-components/NameInput'
import { CommissionInput } from './form-components/CommissionInput'

import { Header, Body, Footer } from '../styled'

export function FormContainer(props) {
  const normalizeCommission = value =>
    !value ? value : value.replace(/[^0-9.]/g, '')

  const isRequired = field => props.requiredFields.includes(field)
  const isVisible = field => props.visibleFields.includes(field)

  return (
    <Fragment>
      <Header>
        <TypeInput
          name="role_type"
          label="Type"
          selectedValue={props.values.role_type}
          style={{ marginRight: '0.5rem' }}
        />

        <Field
          name="role"
          label="Role"
          formRole={props.values.role}
          isAllowedRole={props.isAllowedRole}
          component={Roles}
        />
      </Header>

      <Body>
        <Flex>
          <Field
            name="legal_prefix"
            component={TitleInput}
            isVisible={isVisible('title')}
          />

          <Field
            name="legal_first_name"
            autocompleteField="first_name"
            label="First Name"
            isVisible={isVisible('legal_first_name')}
            isRequired={isRequired('legal_first_name')}
            mutators={props.form.mutators}
            component={NameInput}
            style={{ flex: 3, marginRight: '0.5rem' }}
          />

          <Field
            name="legal_middle_name"
            label="Mid. Name"
            isVisible={isVisible('legal_middle_name')}
            component={TextInput}
            style={{ flex: 1.5, marginRight: '0.5rem' }}
          />

          <Field
            name="legal_last_name"
            autocompleteField="last_name"
            label="Last Name"
            isVisible={isVisible('legal_last_name')}
            isRequired={isRequired('legal_last_name')}
            component={NameInput}
            mutators={props.form.mutators}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="company"
            label="Company / Trust"
            isVisible={isVisible('company')}
            isRequired={isRequired('company')}
            component={TextInput}
            style={{ flex: 7, marginRight: '0.5rem' }}
          />

          <Field
            name="mls_id"
            label="MLS ID"
            isVisible={isVisible('mls_id')}
            mutators={props.form.mutators}
            component={MlsIdInput}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="email"
            label="Email"
            isVisible={isVisible('email')}
            isRequired={isRequired('email')}
            component={TextInput}
            style={{ flex: 5, marginRight: '0.5rem' }}
          />

          <Field
            name="phone"
            label="Phone"
            isVisible={isVisible('phone_number')}
            isRequired={isRequired('phone_number')}
            component={TextInput}
            style={{ flex: 5 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="current_address"
            label="Current Address"
            isVisible={isVisible('current_address')}
            value={props.values.current_address}
            component={Address}
            style={{ flex: 5, marginRight: '0.5rem' }}
          />

          <Field
            name="future_address"
            label="Future Address"
            isVisible={isVisible('future_address')}
            value={props.values.future_address}
            component={Address}
            style={{ flex: 5 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            parse={normalizeCommission}
            isVisible={isVisible('commission')}
            isRequired={isRequired('commission')}
            name="commission"
            placeholder="Commission"
            commissionType={props.values.commission_type}
            component={CommissionInput}
          />
        </Flex>
      </Body>

      <Footer>
        <Flex>
          <Tooltip caption="Delete Role">
            <IconButton isFit iconSize="large" onClick={props.onDeleteRole}>
              <TrashIcon />
            </IconButton>
          </Tooltip>
        </Flex>

        <Flex>
          <LinkButton onClick={props.onClose}>Cancel</LinkButton>
          <ActionButton appearance="outline">Save</ActionButton>
          <ActionButton
            style={{
              marginLeft: '0.5rem'
            }}
          >
            Save & Add to My Contacts
          </ActionButton>
        </Flex>
      </Footer>
    </Fragment>
  )
}
