import { Field, FieldProps } from 'react-final-form'

import { ReactNode } from 'react'

import AgentAutocompleteField, {
  AgentAutocompleteFieldProps
} from '../AgentAutocompleteField'
import ContactAutocompleteField from '../ContactAutocompleteField'

import ActiveTeamAvailableMemberAutocompleteField, {
  ActiveTeamAvailableMemberAutocompleteFieldProps
} from '../ActiveTeamAvailableMemberAutocompleteField'

interface ShowingRoleFormDialogNameFieldProps
  extends Pick<FieldProps<string, any>, 'validate'> {
  name: string
  label: string
  roleValue: Optional<IShowingRoleType>
  selectUserMutator: (...args: any) => any
  selectAgentMutator: (...args: any) => any
  selectContactMutator: (...args: any) => any
  searchFieldValue: AgentAutocompleteFieldProps['searchFieldValue'] &
    ActiveTeamAvailableMemberAutocompleteFieldProps['searchFieldValue']
  required?: boolean
  helperText?: ReactNode
}
function ShowingRoleFormDialogNameField({
  roleValue,
  selectUserMutator,
  selectContactMutator,
  selectAgentMutator,
  searchFieldValue,
  label,
  required = false,
  helperText,
  ...otherProps
}: ShowingRoleFormDialogNameFieldProps) {
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
          <ActiveTeamAvailableMemberAutocompleteField
            label={label}
            searchFieldValue={searchFieldValue}
            inputValue={value}
            onInputChange={onChange}
            onChange={selectUserMutator}
            required={required}
            error={hasError}
            helperText={errorOrHelperText}
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

export default ShowingRoleFormDialogNameField
