import React, { useState } from 'react'

import {
  Box,
  Grid as MuiGrid,
  Button as MuiButton,
  Tooltip,
  Divider,
  Typography
} from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import { spacing } from '@material-ui/system'

import { RoleName } from '@app/components/Pages/Dashboard/Deals/components/Roles/RoleName'
import { useDealsRolesContext } from '@app/contexts/deals-roles-definitions/use-deals-roles-context'

import Field from '../components/CustomField'
import DeleteRole from '../components/DeleteRole'
import { TYPE_PERSON } from '../constants/role-types'
import { getAutocompleteOptions } from '../helpers/get-autocomplete-options'

import { Address } from './form-fields/Address'
import { AutoCompleteInput } from './form-fields/AutoCompleteInput'
import { CommissionInput } from './form-fields/CommissionInput'
import { MlsInput } from './form-fields/MlsInput'
import { MlsSelect } from './form-fields/MlsSelect'
import { NameInput } from './form-fields/NameInput'
import { Roles } from './form-fields/Roles'
import { TextInput } from './form-fields/TextInput'
import { TitleInput } from './form-fields/TitleInput'
import { TypeInput } from './form-fields/TypeInput'
import { useRoleContacts } from './hooks/use-role-contacts'

const Button = styled(MuiButton)(spacing)
const Grid = styled(MuiGrid)(spacing)

export function RoleForm(props) {
  const { dealRolesByName } = useDealsRolesContext()
  const [showNameDetails, setShowNameDetails] = useState(
    props.values.legal_prefix || props.values.legal_middle_name
  )

  const relatedContacts = useRoleContacts(
    props.isNewRecord ? null : props.values
  )

  const hasErrors = Object.keys(props.errors).length > 0
  const isRequired = field => props.requiredFields.includes(field)
  const isVisible = field => props.visibleFields.includes(field)
  const showNewContactButton =
    relatedContacts?.length === 0 ||
    (props.isNewRecord &&
      props.values.email !== props.userEmail &&
      !props.values.contact)

  const showUpdateContactButton =
    props.values.email !== props.userEmail && props.values.contact

  const { role: selectedRole, role_type: roleType, agents } = props.values

  const compact = props.compact

  const getTooltip = () => {
    if (Object.keys(props.errors).length === 0) {
      return ''
    }

    return Object.values(props.errors).map((text, index) => (
      <div key={index}>{text}</div>
    ))
  }

  return (
    <Grid
      container
      style={{
        flexGrow: 1
      }}
      spacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h6">
          {props.title || (
            <>
              Add{' '}
              {selectedRole
                ? dealRolesByName[selectedRole]?.title
                : ' New Role'}
            </>
          )}
        </Typography>
      </Grid>

      <Grid item xs={12} mt={1} mb={1}>
        <TypeInput
          name="role_type"
          label="Type"
          selectedValue={props.values.role_type}
        />
      </Grid>

      {roleType === TYPE_PERSON && (
        <>
          {showNameDetails ? (
            <Grid container xs spacing={2} alignItems="center" mt={1}>
              <Grid item md={compact ? 12 : 6} xs={12}>
                <Field
                  name="legal_prefix"
                  component={TitleInput}
                  isVisible={isVisible('title')}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container xs spacing={2} alignItems="center">
              <Grid item md xs={12}>
                <MuiButton onClick={() => setShowNameDetails(true)}>
                  Add title and middle name
                </MuiButton>
              </Grid>
            </Grid>
          )}
        </>
      )}

      <Grid container xs={12} spacing={2} alignItems="center" mt={1}>
        <Grid item md={compact ? 12 : 6} xs={12}>
          <Field
            name="role"
            label="Role"
            deal={props.deal}
            isRequired={isRequired('role')}
            isAllowedRole={props.isAllowedRole}
            component={Roles}
          />
        </Grid>
      </Grid>

      {roleType === TYPE_PERSON && (
        <Grid container xs spacing={2} alignItems="center" mt={1}>
          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              name="legal_first_name"
              searchFieldValue="display_name"
              searchFieldLabel="display_name"
              label="First Name"
              isVisible={isVisible('legal_first_name')}
              isRequired={isRequired('legal_first_name')}
              crmSearch={!isVisible('mls_id')}
              autoTrim={false}
              mutators={props.form.mutators}
              component={NameInput}
            />
          </Grid>

          {showNameDetails && (
            <Grid item md={compact ? 12 : true} xs={12}>
              <Field
                name="legal_middle_name"
                label="Mid. Name"
                isVisible={isVisible('legal_middle_name')}
                component={TextInput}
              />
            </Grid>
          )}

          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              name="legal_last_name"
              searchFieldValue="display_name"
              searchFieldLabel="display_name"
              label="Last Name"
              isVisible={isVisible('legal_last_name')}
              isRequired={isRequired('legal_last_name')}
              crmSearch={!isVisible('mls_id')}
              autoTrim={false}
              component={NameInput}
              mutators={props.form.mutators}
            />
          </Grid>
        </Grid>
      )}

      {(isVisible('email') || isVisible('phone_number')) && (
        <Grid container xs={12} spacing={2} alignItems="center" mt={1}>
          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              name="email"
              label="Email"
              isVisible={isVisible('email')}
              isRequired={isRequired('email')}
              options={getAutocompleteOptions(props.values, 'emails')}
              component={AutoCompleteInput}
            />
          </Grid>
          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              name="phone_number"
              label="Phone"
              isVisible={isVisible('phone_number')}
              isRequired={isRequired('phone_number')}
              component={AutoCompleteInput}
              options={getAutocompleteOptions(props.values, 'phone_numbers')}
            />
          </Grid>
        </Grid>
      )}

      {isVisible('company_title') && (
        <Grid container xs={12} spacing={2} alignItems="center" mt={1}>
          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              name="company_title"
              label="Company / Trust"
              searchFieldValue="company"
              searchFieldLabel="company"
              isVisible={isVisible('company_title')}
              isRequired={isRequired('company_title')}
              component={NameInput}
              autoTrim={false}
              crmSearch // always search company in crm contacts
              mutators={props.form.mutators}
            />
          </Grid>
        </Grid>
      )}

      {isVisible('mls_id') && agents?.length <= 1 && (
        <Grid container xs={12} spacing={2} alignItems="center" mt={1}>
          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              name="mls_id"
              label="MLS ID"
              isVisible={isVisible('mls_id')}
              mutators={props.form.mutators}
              component={MlsInput}
            />
          </Grid>
        </Grid>
      )}

      {isVisible('mls_id') && agents?.length > 1 && (
        <Grid container xs={12} spacing={2} alignItems="center" mt={1}>
          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              isRequired
              name="mls_id"
              label="MLS"
              agents={agents}
              mutators={props.form.mutators}
              component={MlsSelect}
            />
          </Grid>
        </Grid>
      )}

      {isVisible('current_address') && (
        <Grid container xs={12} spacing={2} alignItems="center" mt={1}>
          <Grid item md={compact ? 12 : true} xs={12}>
            <Field
              name="current_address"
              label="Current Address"
              isVisible={isVisible('current_address')}
              component={Address}
            />
          </Grid>
        </Grid>
      )}

      {isVisible('commission') && (
        <>
          <Box mt={2}>
            {selectedRole && (
              <Typography variant="h6">
                <RoleName name={selectedRole} />
                's Commission
              </Typography>
            )}
          </Box>

          <Grid container xs={12} spacing={2} alignItems="center" mt={1}>
            <CommissionInput
              compact={compact}
              isVisible={isVisible('commission')}
              isRequired={isRequired('commission')}
            />
          </Grid>
        </>
      )}

      <Grid item xs={12} mt={1}>
        <Divider />
      </Grid>

      <Grid container xs={12} my={1}>
        <Grid md={compact ? 12 : 4} xs={12}>
          <Box
            display="flex"
            justifyContent={compact ? 'flex-end' : 'flex-start'}
          >
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
        </Grid>

        <Grid md={compact ? 12 : 8} mt={compact ? 1 : 0} xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={props.onClose}>Cancel</Button>

            {props.isSubmitting ? (
              <Button>{props.isNewRecord ? 'Saving...' : 'Updating...'}</Button>
            ) : (
              <>
                <Tooltip placement="top" title={getTooltip()}>
                  <span>
                    <Button
                      ml={1}
                      variant={
                        showNewContactButton || showUpdateContactButton
                          ? 'outlined'
                          : 'contained'
                      }
                      color={
                        showNewContactButton || showUpdateContactButton
                          ? 'secondary'
                          : 'primary'
                      }
                      disabled={hasErrors}
                      onClick={() => props.onSubmit(props.form, false)}
                    >
                      Save
                    </Button>
                  </span>
                </Tooltip>

                {(showNewContactButton || showUpdateContactButton) && (
                  <Tooltip placement="top" title={getTooltip()}>
                    <span>
                      <Button
                        ml={1}
                        variant="contained"
                        color="primary"
                        disabled={hasErrors}
                        onClick={() => props.onSubmit(props.form, true)}
                      >
                        Save &{' '}
                        {props.values.contact
                          ? 'Update Contact'
                          : 'Add to My Contacts'}
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}
