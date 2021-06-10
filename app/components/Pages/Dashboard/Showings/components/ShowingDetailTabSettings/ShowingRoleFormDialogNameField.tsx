import { Field } from 'react-final-form'

import AgentAutocompleteField, {
  AgentAutocompleteFieldProps
} from '../AgentAutocompleteField'
import ContactAutocompleteField from '../ContactAutocompleteField'

import ActiveTeamAvailableMemberAutocompleteField, {
  ActiveTeamAvailableMemberAutocompleteFieldProps
} from '../ActiveTeamAvailableMemberAutocompleteField'

interface ShowingRoleFormDialogNameFieldProps {
  name: string
  label: string
  roleValue: Optional<IShowingRoleType>
  selectUserMutator: (...args: any) => any
  selectAgentMutator: (...args: any) => any
  selectContactMutator: (...args: any) => any
  searchFieldValue: AgentAutocompleteFieldProps['searchFieldValue'] &
    ActiveTeamAvailableMemberAutocompleteFieldProps['searchFieldValue']
}
function ShowingRoleFormDialogNameField({
  roleValue,
  selectUserMutator,
  selectContactMutator,
  name,
  selectAgentMutator,
  searchFieldValue,
  label
}: ShowingRoleFormDialogNameFieldProps) {
  return (
    <Field
      name={name}
      render={({ input }) =>
        roleValue === 'Tenant' ? (
          <ContactAutocompleteField
            label={label}
            required
            searchFieldValue="display_name"
            inputValue={input.value}
            onInputChange={input.onChange}
            onChange={selectContactMutator}
          />
        ) : roleValue === 'SellerAgent' ? (
          <ActiveTeamAvailableMemberAutocompleteField
            label={label}
            required
            searchFieldValue={searchFieldValue}
            inputValue={input.value}
            onInputChange={input.onChange}
            onChange={selectUserMutator}
          />
        ) : (
          <AgentAutocompleteField
            label={label}
            required
            searchFieldValue={searchFieldValue}
            inputValue={input.value}
            onInputChange={input.onChange}
            onChange={selectAgentMutator}
          />
        )
      }
    />
  )
}

export default ShowingRoleFormDialogNameField
