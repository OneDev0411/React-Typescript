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
import { AutoCompleteInput } from './form-components/AutoCompleteInput'
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
            component={AutoCompleteInput}
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
            component={AutoCompleteInput}
            mutators={props.form.mutators}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="company"
            label="Company / Trust"
            form={props.form}
            isVisible={isVisible('company')}
            isRequired={isRequired('company')}
            component={AutoCompleteInput}
            options={getAutocompleteOptions(
              props.formObject,
              'company',
              'companies'
            )}
            style={{ flex: 7, marginRight: '0.5rem' }}
          />

          <Field
            name="mls_id"
            label="MLS ID"
            isVisible={isVisible('mls_id')}
            mutators={props.form.mutators}
            component={AutoCompleteInput}
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
            name="phone"
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
          <Tooltip caption="Delete Role">
            <IconButton isFit iconSize="large" onClick={props.onDeleteRole}>
              <TrashIcon />
            </IconButton>
          </Tooltip>
        </Flex>

        <Flex>
          <LinkButton onClick={props.onClose}>Cancel</LinkButton>

          {props.isSubmitting ? (
            <ActionButton>
              {props.isNewRecord ? 'Saving...' : 'Updating...'}
            </ActionButton>
          ) : (
            <Fragment>
              <ActionButton
                appearance={props.isNewRecord ? 'outline' : 'primary'}
                onClick={() => props.onSubmit(props.form, false)}
              >
                Save
              </ActionButton>

              {props.isNewRecord && (
                <ActionButton
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
