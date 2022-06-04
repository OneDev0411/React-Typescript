import { FlexItem } from 'styled-flex-component'

import { BasicMultiSelectDropdown } from 'components/BasicMultiSelectDropdown'
import { TextWithHighlights } from 'components/TextWithHighlights'
import { notUndefined } from 'utils/ts-utils'

import { InviteButton } from './InviteButton'
import {
  DeactivatedOverlay,
  TeamMemberItem,
  TeamMemberSubTitle,
  TeamMemberTitle,
  UserAvatar
} from './styled'

interface Props {
  team: IBrand
  user: IUser
  userRoles: IBrandRole[]
  allRoles: IBrandRole[]
  isSaving: boolean
  onRolesChanged: (roles: IBrandRole[]) => void
}

export function TeamMember({
  team,
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
        size={40}
        name={user.display_name}
        image={user.profile_image_url || ''}
      />
      <FlexItem grow={1}>
        <TeamMemberTitle>
          <TextWithHighlights>{user.display_name}</TextWithHighlights>
        </TeamMemberTitle>
        <TeamMemberSubTitle>
          <TextWithHighlights>{user.email}</TextWithHighlights>
        </TeamMemberSubTitle>
      </FlexItem>
      {user.is_shadow ? (
        <InviteButton team={team} user={user} userRoles={userRoles} />
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
