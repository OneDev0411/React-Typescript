import React from 'react'

import * as PropTypes from 'prop-types'

import { ScrollableArea } from '../../../../../../views/components/ScrollableArea'

import Link from '../../../../../../views/components/ALink'

import { SideMenuContainer, SideMenuList, SubTitle } from './styled'
import TeamSwitcher from './TeamSwitcher'
import { ListItemDivider } from '../../styled'
import Acl from '../../../../../../views/components/Acl'

UserMenuContent.propTypes = {
  user: PropTypes.shape().isRequired,
  onClose: PropTypes.func
}

export function UserMenuContent({ user, onClose = () => {} }) {
  return (
    <SideMenuContainer>
      <ScrollableArea hasThinnerScrollbar>
        <SideMenuList>
          <TeamSwitcher user={user} />
        </SideMenuList>
      </ScrollableArea>

      <SideMenuList>
        {user.teams && user.teams.length > 1 && (
          <SubTitle>Team Settings</SubTitle>
        )}
        <Acl.Admin>
          <li>
            <Link noStyle to="/dashboard/teams" onClick={onClose}>
              Members
            </Link>
          </li>
        </Acl.Admin>
        {/* <Acl.Admin accessControlPolicy="Root">
          <li>
            <Link noStyle to="/dashboard/checklists" onClick={onClose}>
              Checklists
            </Link>
          </li>
        </Acl.Admin> */}
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
