import React from 'react'

import { Box, Button as MuiButton } from '@material-ui/core'
import { spacing } from '@material-ui/system'
import { styled } from '@material-ui/core/styles'

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
import { TextInput } from './form-fields/TextInput'

import { getAutocompleteOptions } from '../helpers/get-autocomplete-options'

const Button = styled(MuiButton)(spacing)

export function RoleForm(props) {
  const isRequired = field => props.requiredFields.includes(field)
  const isVisible = field => props.visibleFields.includes(field)
  const showSaveContactButton =
    props.isNewRecord && props.values.email !== props.userEmail

  return (
    <>
      <TypeInput
        name="role_type"
        label="Type"
        selectedValue={props.values.role_type}
      />

      <Field
        name="role"
        label="Role"
        isRequired={isRequired('role')}
        isAllowedRole={props.isAllowedRole}
        component={Roles}
      />

      <Box display="flex" justifyContent="space-between" my={2}>
        <Box flex={2} mr={1}>
          <Field
            name="legal_prefix"
            component={TitleInput}
            isVisible={isVisible('title')}
          />
        </Box>

        <Box flex={3} mr={1}>
          <Field
            name="legal_first_name"
            searchFieldValue="first_name"
            searchFieldLabel="display_name"
            label="First Name"
            isVisible={isVisible('legal_first_name')}
            isRequired={isRequired('legal_first_name')}
            crmSearch={!isVisible('mls_id')}
            mutators={props.form.mutators}
            component={NameInput}
          />
        </Box>

        <Box flex={3} mr={1}>
          <Field
            name="legal_middle_name"
            label="Mid. Name"
            isVisible={isVisible('legal_middle_name')}
            component={TextInput}
          />
        </Box>

        <Box flex={3}>
          <Field
            name="legal_last_name"
            searchFieldValue="last_name"
            searchFieldLabel="display_name"
            label="Last Name"
            isVisible={isVisible('legal_last_name')}
            isRequired={isRequired('legal_last_name')}
            crmSearch={!isVisible('mls_id')}
            component={NameInput}
            mutators={props.form.mutators}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" my={2}>
        <Box flex={6} mr={1}>
          <Field
            name="company_title"
            label="Company / Trust"
            searchFieldValue="company"
            searchFieldLabel="company"
            isVisible={isVisible('company_title')}
            isRequired={isRequired('company_title')}
            component={NameInput}
            crmSearch // always search company in crm contacts
            mutators={props.form.mutators}
          />
        </Box>

        <Box flex={4}>
          <Field
            name="mls_id"
            label="MLS ID"
            isVisible={isVisible('mls_id')}
            mutators={props.form.mutators}
            component={MlsInput}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" my={2}>
        <Box flex={5} mr={1}>
          <Field
            name="email"
            label="Email"
            isVisible={isVisible('email')}
            isRequired={isRequired('email')}
            options={getAutocompleteOptions(props.values, 'emails')}
            component={AutoCompleteInput}
          />
        </Box>

        <Box flex={5}>
          <Field
            name="phone_number"
            label="Phone"
            isVisible={isVisible('phone_number')}
            isRequired={isRequired('phone_number')}
            component={AutoCompleteInput}
            options={getAutocompleteOptions(props.values, 'phone_numbers')}
          />
        </Box>
      </Box>

      <Box my={2}>
        <Field
          name="current_address"
          label="Current Address"
          isVisible={isVisible('current_address')}
          component={Address}
        />
      </Box>

      <Box my={2}>
        <CommissionInput
          isVisible={isVisible('commission')}
          isRequired={isRequired('commission')}
        />
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Box display="flex">
          {props.isRoleRemovable && (
            <DeleteRole
              deal={props.deal}
              role={props.initialValues}
              onDeleteRole={props.onDeleteRole}
            />
          )}

          {props.values.contact && (
            <Button
              href={`/dashboard/contacts/${props.values.contact.id}`}
              target="_blank"
            >
              Open Contact Profile
            </Button>
          )}
        </Box>

        <Box alignCenter textAlign="right">
          <Button onClick={props.onClose}>Cancel</Button>

          {props.isSubmitting ? (
            <Button>{props.isNewRecord ? 'Saving...' : 'Updating...'}</Button>
          ) : (
            <>
              <Button
                variant="outlined"
                ml={1}
                onClick={() => props.onSubmit(props.form, false)}
              >
                Save
              </Button>

              {showSaveContactButton && (
                <Button
                  variant="contained"
                  color="secondary"
                  ml={1}
                  onClick={() => props.onSubmit(props.form, true)}
                >
                  Save &{' '}
                  {props.values.contact
                    ? 'Update Contact'
                    : 'Add to My Contacts'}
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  )
}
