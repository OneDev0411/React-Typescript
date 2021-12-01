import { useState, useMemo } from 'react'

import { Popover, Theme, makeStyles } from '@material-ui/core'
import usePromise from 'react-use-promise'

import { IUserState } from 'reducers/user'

import { getBrandChecklists } from '../../../../../../models/BrandConsole/Checklists'
import { getActiveTeamId } from '../../../../../../utils/user-teams'

import ToggleButton from './ToggleButton'
import { UserMenuContent } from './UserMenuContent'

const useStyles = makeStyles(
  (theme: Theme) => ({
    popover: {
      marginLeft: theme.spacing(1.25),
      boxShadow: theme.shadows[2]
    }
  }),
  { name: 'UserMenu' }
)

export function UserMenu({ user }: { user: IUserState }) {
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
  const classes = useStyles()
  const teamId = useMemo(() => getActiveTeamId(user), [user])

  const [checklists] = usePromise(() => {
    return (teamId && getBrandChecklists(teamId)) || Promise.reject()
  }, [teamId])

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isOpen = Boolean(anchorEl)
  const id = isOpen ? 'user-menu-popover' : ''

  if (!user) {
    return null
  }

  return (
    <>
      <ToggleButton id={id} isOpen={isOpen} onClick={handleClick} user={user} />
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        classes={{
          paper: classes.popover
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <UserMenuContent
          user={user}
          onClose={handleClose}
          showChecklists={checklists ? checklists.length > 0 : false}
        />
      </Popover>
    </>
  )
}
