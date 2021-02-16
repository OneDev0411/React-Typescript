import React, { useState } from 'react'

import {
  Box,
  Button as MuiButton,
  Divider,
  Typography
} from '@material-ui/core'
import { spacing } from '@material-ui/system'
import { styled } from '@material-ui/core/styles'

import {
  mdiTicketPercentOutline,
  mdiCardAccountMailOutline,
  mdiHomeCityOutline,
  mdiAccountCircleOutline,
  mdiFormatListChecks,
  mdiMapMarkerOutline
} from '@mdi/js'

import { roleName } from 'deals/utils/roles'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
import { TYPE_PERSON } from '../constants/role-types'

const Button = styled(MuiButton)(spacing)

const ICON_CONTAINER_SIZE = 1
const FIELDS_CONTAINER_SIZE = 12
const ROW_MARGIN = 3
const COLUMN_GUTTER = '2%'
const COLUMN_WIDTH = '49%'

export function RoleForm(props) {
  const [showNameDetails, setShowNameDetails] = useState(false)

  const isRequired = field => props.requiredFields.includes(field)
  const isVisible = field => props.visibleFields.includes(field)
  const showSaveContactButton =
    props.isNewRecord &&
    props.values.email !== props.userEmail &&
    !props.values.contact

  const selectedRole = props.values.role
  const roleType = props.values.role_type

  return (
    <>
      <Typography variant="h6">
        Add {selectedRole ? roleName(selectedRole) : ' New Role'}
      </Typography>

      <Box display="flex" mt={ROW_MARGIN}>
        <Box flex={ICON_CONTAINER_SIZE} />

        <Box flex={FIELDS_CONTAINER_SIZE}>
          <TypeInput
            name="role_type"
            label="Type"
            selectedValue={props.values.role_type}
          />
        </Box>
      </Box>

      <Box display="flex" mt={ROW_MARGIN}>
        <Box display="flex" flex={ICON_CONTAINER_SIZE} alignItems="center">
          <SvgIcon path={mdiFormatListChecks} />
        </Box>
        <Box flex={FIELDS_CONTAINER_SIZE}>
          <Field
            name="role"
            label="Role"
            isRequired={isRequired('role')}
            isAllowedRole={props.isAllowedRole}
            component={Roles}
          />
        </Box>
      </Box>

      {roleType === TYPE_PERSON && (
        <Box display="flex" mt={ROW_MARGIN}>
          <Box display="flex" flex={ICON_CONTAINER_SIZE} alignItems="center">
            <SvgIcon path={mdiAccountCircleOutline} />
          </Box>

          <Box display="flex" flex={FIELDS_CONTAINER_SIZE}>
            <Box width={COLUMN_WIDTH} mr={COLUMN_GUTTER}>
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

            <Box width={COLUMN_WIDTH}>
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
        </Box>
      )}

      <Box mt={roleType === TYPE_PERSON ? ROW_MARGIN : 0}>
        {showNameDetails ? (
          <Box display="flex">
            <Box display="flex" flex={ICON_CONTAINER_SIZE} alignItems="center">
              <SvgIcon path={mdiAccountCircleOutline} />
            </Box>

            <Box display="flex" flex={FIELDS_CONTAINER_SIZE}>
              <Box width={COLUMN_WIDTH} mr={COLUMN_GUTTER}>
                <Field
                  name="legal_prefix"
                  component={TitleInput}
                  isVisible={isVisible('title')}
                />
              </Box>

              <Box width={COLUMN_WIDTH}>
                <Field
                  name="legal_middle_name"
                  label="Mid. Name"
                  isVisible={isVisible('legal_middle_name')}
                  component={TextInput}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box display="flex">
            <Box flex={ICON_CONTAINER_SIZE} />
            <Box flex={FIELDS_CONTAINER_SIZE}>
              <MuiButton
                color="secondary"
                onClick={() => setShowNameDetails(true)}
              >
                Add title and middle name
              </MuiButton>
            </Box>
          </Box>
        )}
      </Box>

      {(isVisible('company_title') || isVisible('mls_id')) && (
        <Box display="flex" mt={ROW_MARGIN}>
          <Box display="flex" flex={ICON_CONTAINER_SIZE} alignItems="center">
            <SvgIcon path={mdiHomeCityOutline} />
          </Box>

          <Box display="flex" flex={FIELDS_CONTAINER_SIZE}>
            <Box width={COLUMN_WIDTH} mr={COLUMN_GUTTER}>
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

            <Box width={COLUMN_WIDTH}>
              <Field
                name="mls_id"
                label="MLS ID"
                isVisible={isVisible('mls_id')}
                mutators={props.form.mutators}
                component={MlsInput}
              />
            </Box>
          </Box>
        </Box>
      )}

      {(isVisible('email') || isVisible('phone_number')) && (
        <Box display="flex" mt={ROW_MARGIN}>
          <Box display="flex" flex={ICON_CONTAINER_SIZE} alignItems="center">
            <SvgIcon path={mdiCardAccountMailOutline} />
          </Box>

          <Box display="flex" flex={FIELDS_CONTAINER_SIZE}>
            <Box width={COLUMN_WIDTH} mr={COLUMN_GUTTER}>
              <Field
                name="email"
                label="Email"
                isVisible={isVisible('email')}
                isRequired={isRequired('email')}
                options={getAutocompleteOptions(props.values, 'emails')}
                component={AutoCompleteInput}
              />
            </Box>

            <Box width={COLUMN_WIDTH}>
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
        </Box>
      )}

      {isVisible('current_address') && (
        <Box display="flex" mt={ROW_MARGIN}>
          <Box display="flex" flex={ICON_CONTAINER_SIZE} alignItems="center">
            <SvgIcon path={mdiMapMarkerOutline} />
          </Box>

          <Box flex={FIELDS_CONTAINER_SIZE}>
            <Field
              name="current_address"
              label="Current Address"
              isVisible={isVisible('current_address')}
              component={Address}
            />
          </Box>
        </Box>
      )}

      {isVisible('commission') && (
        <>
          <Box my={2}>
            {selectedRole && (
              <Typography variant="h6">
                {roleName(selectedRole)}'s Commission
              </Typography>
            )}
          </Box>

          <Box display="flex" mt={ROW_MARGIN}>
            <Box display="flex" flex={ICON_CONTAINER_SIZE} alignItems="center">
              <SvgIcon path={mdiTicketPercentOutline} />
            </Box>

            <Box flex={FIELDS_CONTAINER_SIZE}>
              <CommissionInput
                isVisible={isVisible('commission')}
                isRequired={isRequired('commission')}
              />
            </Box>
          </Box>
        </>
      )}

      <Box my={2}>
        <Divider />
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
                ml={1}
                variant={showSaveContactButton ? 'outlined' : 'contained'}
                color={showSaveContactButton ? 'secondary' : 'primary'}
                onClick={() => props.onSubmit(props.form, false)}
              >
                Save
              </Button>

              {showSaveContactButton && (
                <Button
                  ml={1}
                  variant="contained"
                  color="primary"
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
