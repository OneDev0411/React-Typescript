import { ReactNode } from 'react'

import { Field, FieldProps } from 'react-final-form'

import { ACL } from 'constants/acl'

import ActiveTeamAvailableMemberWithPermissionAutocompleteField, {
  ActiveTeamAvailableMemberWithPermissionAutocompleteFieldProps
} from '../ActiveTeamAvailableMemberWithPermissionAutocompleteField'
import AgentAutocompleteField, {
  AgentAutocompleteFieldProps
} from '../AgentAutocompleteField'
import ContactAutocompleteField from '../ContactAutocompleteField'

interface ShowingRoleFormNameFieldProps
  extends Pick<FieldProps<string, any>, 'validate'> {
  name: string
  label: string
  roleValue: Optional<IShowingRoleType>
  selectUserMutator: (...args: any) => any
  selectAgentMutator: (...args: any) => any
  selectContactMutator: (...args: any) => any
  searchFieldValue: AgentAutocompleteFieldProps['searchFieldValue'] &
    ActiveTeamAvailableMemberWithPermissionAutocompleteFieldProps['searchFieldValue']
  required?: boolean
  helperText?: ReactNode
}
function ShowingRoleFormNameField({
  roleValue,
  selectUserMutator,
  selectContactMutator,
  selectAgentMutator,
  searchFieldValue,
  label,
  required = false,
  helperText,
  ...otherProps
}: ShowingRoleFormNameFieldProps) {
  return (
    <Field
      {...otherProps}
      required={required}
      render={({ input: { value, onChange }, meta }) => {
        const hasError: boolean =
          ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
          meta.touched

        const errorOrHelperText = hasError
          ? meta.error || meta.submitError
          : helperText

        return roleValue === 'Tenant' ? (
          <ContactAutocompleteField
            label={label}
            searchFieldValue="display_name"
            inputValue={value}
            onInputChange={onChange}
            onChange={selectContactMutator}
            required={required}
            error={hasError}
            helperText={errorOrHelperText}
          />
        ) : roleValue === 'SellerAgent' ? (
          <ActiveTeamAvailableMemberWithPermissionAutocompleteField
            label={label}
            searchFieldValue={searchFieldValue}
            inputValue={value}
            onInputChange={onChange}
            onChange={selectUserMutator}
            required={required}
            error={hasError}
            helperText={errorOrHelperText}
            permission={ACL.SHOWINGS}
          />
        ) : (
          <AgentAutocompleteField
            label={label}
            searchFieldValue={searchFieldValue}
            inputValue={value}
            onInputChange={onChange}
            onChange={selectAgentMutator}
            required={required}
            error={hasError}
            helperText={errorOrHelperText}
          />
        )
      }}
    />
  )
}

export default ShowingRoleFormNameField
