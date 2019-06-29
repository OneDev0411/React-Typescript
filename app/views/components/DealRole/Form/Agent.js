import React, { Fragment } from 'react'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'

import { TextInput } from 'components/Forms/TextInput'

import DeleteRole from '../components/DeleteRole'

import Field from '../components/CustomField'

import { TitleInput } from './form-fields/TitleInput'
import { TypeInput } from './form-fields/TypeInput'
import { Roles } from './form-fields/Roles'
import { Address } from './form-fields/Address'
import { AutoCompleteInput } from './form-fields/AutoCompleteInput'
import { NameInput } from './form-fields/NameInput'
import { MlsInput } from './form-fields/MlsInput'
import { CommissionInput } from './form-fields/CommissionInput'

import { getAutocompleteOptions } from '../helpers/get-autocomplete-options'

import { Header, Body, Footer } from '../styled'

export function AgentForm(props) {
  const isRequired = field => props.requiredFields.includes(field)
  const isVisible = field => props.visibleFields.includes(field)
  const showSaveContactButton =
    props.isNewRecord && props.values.email !== props.userEmail

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
          isRequired={isRequired('role')}
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
            searchField="first_name"
            label="First Name"
            isVisible={isVisible('legal_first_name')}
            isRequired={isRequired('legal_first_name')}
            crmSearch={!isVisible('mls_id')}
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
            searchField="last_name"
            label="Last Name"
            isVisible={isVisible('legal_last_name')}
            isRequired={isRequired('legal_last_name')}
            crmSearch={isVisible('mls_id') === false}
            component={NameInput}
            mutators={props.form.mutators}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex>
          <Field
            name="company_title"
            label="Company / Trust"
            form={props.form}
            isVisible={isVisible('company_title')}
            isRequired={isRequired('company_title')}
            component={AutoCompleteInput}
            options={getAutocompleteOptions(props.values, 'companies')}
            style={{ flex: 7, marginRight: '0.5rem' }}
          />

          <Field
            name="mls_id"
            label="MLS ID"
            isVisible={isVisible('mls_id')}
            mutators={props.form.mutators}
            component={MlsInput}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="email"
            label="Email"
            form={props.form}
            isVisible={isVisible('email')}
            isRequired={isRequired('email')}
            component={AutoCompleteInput}
            options={getAutocompleteOptions(props.values, 'emails')}
            style={{ flex: 5, marginRight: '0.5rem' }}
          />

          <Field
            name="phone_number"
            label="Phone"
            form={props.form}
            isVisible={isVisible('phone_number')}
            isRequired={isRequired('phone_number')}
            component={AutoCompleteInput}
            options={getAutocompleteOptions(props.values, 'phone_numbers')}
            style={{ flex: 5 }}
          />
        </Flex>

        <Flex>
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

        <Flex>
          <Field
            name="commission"
            parse={value => (!value ? value : value.replace(/[^0-9.]/g, ''))}
            isVisible={isVisible('commission')}
            isRequired={isRequired('commission')}
            label="Commission"
            commissionType={props.values.commission_type}
            component={CommissionInput}
          />
        </Flex>
      </Body>

      <Footer>
        <Flex>
          {props.isRoleRemovable && (
            <DeleteRole
              deal={props.deal}
              role={props.formObject}
              onDeleteRole={props.onDeleteRole}
            />
          )}

          {props.values.contact && (
            <Fragment>
              <LinkButton
                to={`/dashboard/contacts/${props.values.contact.id}`}
                target="_blank"
                style={{
                  margin: 0,
                  padding: 0
                }}
              >
                Open Contact Profile
              </LinkButton>
            </Fragment>
          )}
        </Flex>

        <Flex alignCenter>
          <LinkButton type="button" onClick={props.onClose}>
            Cancel
          </LinkButton>

          {props.isSubmitting ? (
            <ActionButton size="small">
              {props.isNewRecord ? 'Saving...' : 'Updating...'}
            </ActionButton>
          ) : (
            <Fragment>
              <ActionButton
                size="small"
                appearance={showSaveContactButton ? 'outline' : 'primary'}
                onClick={() => props.onSubmit(props.form, false)}
              >
                Save
              </ActionButton>

              {showSaveContactButton && (
                <ActionButton
                  size="small"
                  onClick={() => props.onSubmit(props.form, true)}
                  style={{
                    marginLeft: '0.5rem'
                  }}
                >
                  Save &{' '}
                  {props.values.contact
                    ? 'Update Contact'
                    : 'Add to My Contacts'}
                </ActionButton>
              )}
            </Fragment>
          )}
        </Flex>
      </Footer>
    </Fragment>
  )
}
