import React from 'react'

import { FlexItem } from 'styled-flex-component'

import { ITeamRole } from 'models/BrandConsole/types'

import { BasicMultiSelectDropdown } from 'components/BasicMultiSelectDropdown'

import { notUndefined } from 'utils/ts-utils'

import {
  DeactivatedOverlay,
  TeamMemberItem,
  TeamMemberSubTitle,
  TeamMemberTitle,
  UserAvatar
} from './styled'

interface Props {
  user: IUser
  userRoles: ITeamRole[]
  allRoles: ITeamRole[]
  isSaving: boolean
  onRolesChanged: (roles: ITeamRole[]) => void
}

export function TeamMember({
  user,
  userRoles,
  allRoles,
  isSaving,
  onRolesChanged
}: Props) {
  return (
    <TeamMemberItem>
      <UserAvatar
        userId={user.id}
        color="#000"
        name={user.display_name}
        image={user.profile_image_url}
      />
      <FlexItem grow={1}>
        <TeamMemberTitle>{user.display_name}</TeamMemberTitle>
        <TeamMemberSubTitle>{user.email}</TeamMemberSubTitle>
      </FlexItem>
      {user.is_shadow ? (
        <span style={{ marginRight: '1rem' }}>Pending</span>
      ) : (
        <BasicMultiSelectDropdown
          disabled={isSaving}
          fullHeight
          noBorder
          buttonAppearance="flat"
          items={allRoles.map(roleToSelectItem)}
          applyChangesOnClose
          buttonStyle={{ zIndex: 1 }}
          onChange={selectedItems => {
            const selectedItemToRole = item =>
              allRoles!.find(role => role.id === item.value)

            onRolesChanged(
              selectedItems.map(selectedItemToRole).filter(notUndefined)
            )
          }}
          placeholder="Deactivated"
          selectedItems={userRoles.map(roleToSelectItem)}
          menuStyle={{ zIndex: 3, minWidth: 150 }}
          style={{ marginRight: '1rem' }}
        />
      )}
      {!userRoles.length && <DeactivatedOverlay />}
    </TeamMemberItem>
  )
}

function roleToSelectItem(role) {
  return {
    label: role.role,
    value: role.id
  }
}
