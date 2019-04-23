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
import { TypeInput, TYPE_PERSON } from './form-components/TypeInput'
import { Roles } from './form-components/Roles'
import { Address } from './form-components/Address'

import { Header, Body, Footer } from '../styled'

export function FormContainer(props) {
  const { role_type } = props.values
  const isCompanyRequired = props.requiredFields.includes('company_title')
  const isFirstNameRequired = props.requiredFields.includes('legal_first_name')
  const isLastNameRequired = props.requiredFields.includes('legal_last_name')

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
          component={Roles}
        />
      </Header>

      <Body>
        <Flex>
          {role_type === TYPE_PERSON && (
            <Field name="legal_prefix" component={TitleInput} />
          )}

          {(role_type === TYPE_PERSON || isFirstNameRequired) && (
            <Field
              name="legal_first_name"
              label="First Name"
              isRequired={isFirstNameRequired}
              component={TextInput}
              style={{ width: '30%', marginRight: '0.5rem' }}
            />
          )}

          {role_type === TYPE_PERSON && (
            <Field
              name="legal_middle_name"
              label="Mid. Name"
              component={TextInput}
              style={{ width: '15%', marginRight: '0.5rem' }}
            />
          )}

          {(role_type === TYPE_PERSON || isLastNameRequired) && (
            <Field
              name="legal_last_name"
              label="Last Name"
              isRequired={isLastNameRequired}
              component={TextInput}
              style={{ width: '30%' }}
            />
          )}
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="company"
            label="Company / Trust"
            isRequired={isCompanyRequired}
            component={TextInput}
            style={{ width: '80%', marginRight: '0.5rem' }}
          />

          <Field name="mls_id" label="MLS ID" component={TextInput} />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="email"
            label="Email"
            isRequired={props.requiredFields.includes('email')}
            component={TextInput}
            style={{ width: '50%', marginRight: '0.5rem' }}
          />

          <Field
            name="phone"
            label="Phone"
            isRequired={props.requiredFields.includes('phone_number')}
            component={TextInput}
            style={{ width: '50%' }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="current_address"
            label="Current Address"
            value={props.values.current_address}
            component={Address}
            style={{ width: '50%', marginRight: '0.5rem' }}
          />

          <Field
            name="future_address"
            label="Future Address"
            value={props.values.future_address}
            component={Address}
            style={{ width: '50%' }}
          />
        </Flex>

        <Flex>
          {/* {shouldShowCommission(values.role) && (
            <Field
              parse={normalizeCommission}
              isRequired={requiredFields.includes('commission')}
              name="commission"
              placeholder="Commission"
              commissionType={values.commission_type}
              component={CommissionInput}
            />
          )} */}
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
