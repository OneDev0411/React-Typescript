import React, { Fragment } from 'react'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'

import { TextInput } from 'components/Forms/TextInput'

import DeleteRole from '../components/DeleteRole'

import { TitleInput } from './form-components/TitleInput'
import { TypeInput } from './form-components/TypeInput'
import { Roles } from './form-components/Roles'
import { Address } from './form-components/Address'
import { AutoCompleteInput } from './form-components/AutoCompleteInput'
import { NameInput } from './form-components/NameInput'
import { MlsInput } from './form-components/MlsInput'
import { CommissionInput } from './form-components/CommissionInput'

import { getAutocompleteOptions } from '../helpers/get-autocomplete-options'

import { Header, Body, Footer } from '../styled'

export function FormContainer(props) {
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
            options={getAutocompleteOptions(
              props.formObject,
              'company_title',
              'companies'
            )}
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
            options={getAutocompleteOptions(
              props.formObject,
              'email',
              'emails'
            )}
            style={{ flex: 5, marginRight: '0.5rem' }}
          />

          <Field
            name="phone_number"
            label="Phone"
            form={props.form}
            isVisible={isVisible('phone_number')}
            isRequired={isRequired('phone_number')}
            component={AutoCompleteInput}
            options={getAutocompleteOptions(
              props.formObject,
              'phone_numbers',
              'phones'
            )}
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
            <DeleteRole deal={props.deal} role={props.formObject} />
          )}
        </Flex>

        <Flex alignCenter>
          <LinkButton onClick={props.onClose}>Cancel</LinkButton>

          {props.isSubmitting ? (
            <ActionButton size="small">
              {props.isNewRecord ? 'Saving...' : 'Updating...'}
            </ActionButton>
          ) : (
            <Fragment>
              <ActionButton
                size="small"
                appearance={props.isNewRecord ? 'outline' : 'primary'}
                onClick={() => props.onSubmit(props.form, false)}
              >
                Save
              </ActionButton>

              {props.isNewRecord && (
                <ActionButton
                  size="small"
                  onClick={() => props.onSubmit(props.form, true)}
                  style={{
                    marginLeft: '0.5rem'
                  }}
                >
                  Save & Add to My Contacts
                </ActionButton>
              )}
            </Fragment>
          )}
        </Flex>
      </Footer>
    </Fragment>
  )
}
