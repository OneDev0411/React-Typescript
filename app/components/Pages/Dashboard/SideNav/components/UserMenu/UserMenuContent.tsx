import React from 'react'

import Acl from '../../../../../../views/components/Acl'
import { ACL } from '../../../../../../constants/acl'
import Link from '../../../../../../views/components/ALink'
import { ScrollableArea } from '../../../../../../views/components/ScrollableArea'

import TeamSwitcher from './TeamSwitcher'
import { ListItemDivider } from '../../styled'
import { SideMenuContainer, SideMenuList, SubTitle } from './styled'

interface Props {
  user: IUser
  onClose?: () => void
  showChecklists: boolean
}

export function UserMenuContent({
  user,
  showChecklists,
  onClose = () => {}
}: Props) {
  return (
    <SideMenuContainer>
      <ScrollableArea hasThinnerScrollbar>
        <SideMenuList>
          <TeamSwitcher user={user} />
        </SideMenuList>
      </ScrollableArea>

      <SideMenuList>
        <Acl.Admin>
          {user.teams && user.teams.length > 1 && (
            <SubTitle>Team Settings</SubTitle>
          )}
          <li>
            <Link noStyle to="/dashboard/teams" onClick={onClose}>
              Members
            </Link>
          </li>
          <Acl.Admin>
            <li>
              <Link noStyle to="/dashboard/contexts" onClick={onClose}>
                Contexts
              </Link>
            </li>
          </Acl.Admin>
          {showChecklists && (
            <li>
              <Link noStyle to="/dashboard/checklists" onClick={onClose}>
                Checklists
              </Link>
            </li>
          )}
          <ListItemDivider role="separator" />
        </Acl.Admin>
        <li>
          <Link noStyle to="/dashboard/account" onClick={onClose}>
            Account settings
          </Link>
        </li>
        <Acl access={[ACL.BACK_OFFICE, ACL.MARKETING]}>
          <li>
            <Link noStyle to="/dashboard/mc-settings" onClick={onClose}>
              Marketing Center Settings
            </Link>
          </li>
        </Acl>
        <ListItemDivider role="separator" />
        <li>
          <a
            href="/signout"
            onClick={() => {
              window.localStorage.removeItem('verificationBanner')
              onClose()
            }}
          >
            Sign out
          </a>
        </li>
      </SideMenuList>
    </SideMenuContainer>
  )
}
