import Downshift from 'downshift'
import Flex from 'styled-flex-component'
import React from 'react'

import usePromise from 'react-use-promise'

import Link from '../../../../../../views/components/Button/LinkButton'

import { UserMenuWrapper } from '../../styled'
import { DropdownButton } from './DropdownButton'
import { UserMenuContent } from './UserMenuContent'
import { getActiveTeamId } from '../../../../../../utils/user-teams'
import { getBrandChecklists } from '../../../../../../models/BrandConsole/Checklists'

interface Props {
  user: IUser
  open: boolean
  onToggle: () => void
  brandLogoSrc: string
}

export function UserMenu(props: Props) {
  /**
   * We need to show checklists link only if users has access to it.
   * Right now, the logic for access is like this:
   * the user should have {@link ACL.ADMIN} access in the active team,
   * AND there should be at least one checklist. It's a little weird,
   * and I think a better approach is to define a separate permission for
   * it maybe, or leave access open based on {@link ACL.ADMIN} only, and
   * handle zero state in the checklists page.
   * You can find out more about this decision in messages around this one:
   * https://rechathq.slack.com/archives/CMXkKY2L31/p1572899859343400
   *
   * NOTE: we could move this piece of code to {@link UserMenuContent} too. That
   * way the request is sent only when the menu is opened (and the
   * UserMenuContent is rendered). But it introduces a delay in showing
   * the link which may be seen as a UX problem.
   */
  const [checklists] = usePromise(() => {
    const teamId = props.user && getActiveTeamId(props.user)

    return (teamId && getBrandChecklists(teamId)) || Promise.reject()
  }, [props.user])

  return props.user ? (
    <Downshift isOpen={props.open} onOuterClick={props.onToggle}>
      {({ isOpen }) => (
        <div>
          <UserMenuWrapper>
            <DropdownButton
              user={props.user}
              bsRole="toggle"
              onClick={props.onToggle}
              isDropDownOpen={props.open}
            />
            {isOpen && (
              <UserMenuContent
                user={props.user}
                showChecklists={checklists && checklists.length > 0}
                onClose={props.onToggle}
              />
            )}
          </UserMenuWrapper>
        </div>
      )}
    </Downshift>
  ) : (
    <Flex center style={{ padding: '0.75em 0' }}>
      <Link to="/">
        <img src={props.brandLogoSrc} alt="Rechat" width="32" height="32" />
      </Link>
    </Flex>
  )
}
