import { useMemo } from 'react'

import { getBrandUsers } from 'utils/user-teams'

import useActiveTeamBrandWithShowingsPermission from '../../hooks/use-active-team-brand-with-permission'
import AutocompleteField, { AutocompleteFieldProps } from '../AutocompleteField'

import { compareLabelsAsc } from './helpers'
import { ActiveTeamMemberOption } from './types'

export interface ActiveTeamAvailableMemberWithPermissionAutocompleteFieldProps
  extends Omit<AutocompleteFieldProps<ActiveTeamMemberOption>, 'options'> {
  searchFieldValue?: keyof IUser
  searchFieldLabel?: keyof IUser
  permission: IPermission
}

function ActiveTeamAvailableMemberWithPermissionAutocompleteField({
  searchFieldValue = 'display_name',
  searchFieldLabel = 'display_name',
  permission,
  ...otherProps
}: ActiveTeamAvailableMemberWithPermissionAutocompleteFieldProps) {
  const activeBrand = useActiveTeamBrandWithShowingsPermission(permission)

  const options = useMemo<ActiveTeamMemberOption[]>(() => {
    const activeTeamAvailableMembers = activeBrand
      ? getBrandUsers(activeBrand)
      : []

    return activeTeamAvailableMembers
      .map(activeTeamAvailableMember => ({
        ...activeTeamAvailableMember,
        value: activeTeamAvailableMember[searchFieldValue] as string,
        label: activeTeamAvailableMember[searchFieldLabel] as string
      }))
      .sort(compareLabelsAsc)
  }, [activeBrand, searchFieldLabel, searchFieldValue])

  return (
    <AutocompleteField<ActiveTeamMemberOption>
      {...otherProps}
      options={options}
    />
  )
}

export default ActiveTeamAvailableMemberWithPermissionAutocompleteField
