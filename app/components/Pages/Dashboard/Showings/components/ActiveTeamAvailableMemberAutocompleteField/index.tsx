import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectActiveTeamAvailableMembers } from 'selectors/team'

import AutocompleteField, {
  AutocompleteFieldProps,
  BaseOption
} from '../AutocompleteField'

type ActiveTeamMemberOption = BaseOption & IUser

export interface ActiveTeamAvailableMemberAutocompleteFieldProps
  extends Omit<AutocompleteFieldProps<ActiveTeamMemberOption>, 'options'> {
  searchFieldValue?: keyof IUser
  searchFieldLabel?: keyof IUser
}

function ActiveTeamAvailableMemberAutocompleteField({
  searchFieldValue = 'display_name',
  searchFieldLabel = 'display_name',
  ...otherProps
}: ActiveTeamAvailableMemberAutocompleteFieldProps) {
  const activeTeamAvailableMembers = useSelector(
    selectActiveTeamAvailableMembers
  )

  const options = useMemo<ActiveTeamMemberOption[]>(
    () =>
      activeTeamAvailableMembers.map(activeTeamAvailableMember => ({
        ...activeTeamAvailableMember,
        value: activeTeamAvailableMember[searchFieldValue] as string,
        label: activeTeamAvailableMember[searchFieldLabel] as string
      })),
    [activeTeamAvailableMembers, searchFieldLabel, searchFieldValue]
  )

  return (
    <AutocompleteField<ActiveTeamMemberOption>
      {...otherProps}
      options={options}
    />
  )
}

export default ActiveTeamAvailableMemberAutocompleteField
