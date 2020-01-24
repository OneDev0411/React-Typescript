import React from 'react'

import Acl from '../../../../../../views/components/Acl'
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
  onClose = () => { }
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
          <Link noStyle to="/dashboard/accounts" onClick={onClose}>
            Account settings
          </Link>
        </li>
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
