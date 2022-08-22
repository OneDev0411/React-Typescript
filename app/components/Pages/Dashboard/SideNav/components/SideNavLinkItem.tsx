import { useContext, useEffect, ReactNode } from 'react'

import { Theme, useMediaQuery, makeStyles } from '@material-ui/core'
import { alpha } from '@material-ui/core/styles'
import cn from 'classnames'
import { Link as RouterLink, withRouter, WithRouterProps } from 'react-router'

import { SideNavContext } from '../../DashboardLayout'
import { BaseAccordionMenu, ExpandedMenu } from '../types'

const useStyles = makeStyles(
  theme => ({
    activeMenu: {
      color: `${theme.palette.common.white} !important`,
      backgroundColor: alpha(theme.navbar.background.contrastText, 0.24),
      ...theme.typography.subtitle1,

      '& svg': {
        color: theme.palette.primary.main
      }
    },
    linkStyle: {
      alignItems: 'center',
      borderRadius: theme.spacing(0, 0.5, 0.5, 0),
      color: theme.palette.grey[400],
      cursor: 'pointer',
      display: 'flex',
      fontSize: theme.typography.body1.fontSize,
      height: '32px',
      lineHeight: theme.typography.body1.lineHeight,
      padding: theme.spacing(0, 0.5),
      width: '100%',

      '&:focus, &:hover': {
        color:
          theme.navbar.background.contrastText ?? theme.palette.primary.main,
        textDecoration: 'none'
      },

      '& svg': {
        position: 'relative',
        top: theme.spacing(-0.125)
      }
    },
    sidenavLink: {
      margin: theme.spacing(0, 0, 1, 0),
      padding: theme.spacing(0, 1, 0, 2.5)
    },
    sidenavLinkSummary: {
      margin: theme.spacing(0, 1, 0, 0),
      padding: theme.spacing(0, 1, 0, 2)
    }
  }),
  {
    name: 'SideNavLinkItem'
  }
)

interface Props {
  children: ReactNode
  isSubmenu?: boolean
  onExpandMenu?: (panel: ExpandedMenu) => void
  onTriggerAction?: () => void
  subMenu?: BaseAccordionMenu[]
  to?: string
  tourId: ExpandedMenu
}

function SideNavLinkItem({
  children,
  isSubmenu = false,
  location,
  onExpandMenu,
  onTriggerAction,
  subMenu,
  to = '',
  tourId
}: Props & WithRouterProps) {
  const classes = useStyles()

  const { onDrawerToggle } = useContext(SideNavContext)

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const active = subMenu
    ? subMenu
        .map(item => item.to)
        .some((route: string) => location.pathname.startsWith(route))
    : !onTriggerAction && location.pathname.startsWith(to)

  // Here we check if the current route is active and there is a
  // related item in the menu, then expand that menu
  useEffect(() => {
    if (!active || !onExpandMenu) {
      return
    }

    onExpandMenu(tourId)
  }, [active, onExpandMenu, tourId])

  const generateLink = () => {
    if (isMobile && subMenu) {
      return ''
    }

    return to
  }

  const handleClick = () => {
    onTriggerAction && onTriggerAction()

    // In mobile size if the menu has the default link,
    // should open the link, and hide the SideNav,
    // else should expand to show sub-menu items
    if (!isMobile || subMenu || !to) {
      return
    }

    onDrawerToggle()
  }

  return isSubmenu ? (
    <RouterLink
      className={cn(
        classes.linkStyle,
        classes.sidenavLink,
        active ? classes.activeMenu : ''
      )}
      data-tour-id={tourId}
      onClick={handleClick}
      to={to}
    >
      {children}
    </RouterLink>
  ) : (
    <RouterLink
      className={cn(
        classes.linkStyle,
        classes.sidenavLinkSummary,
        active && !subMenu ? classes.activeMenu : ''
      )}
      data-tour-id={tourId}
      onClick={handleClick}
      to={generateLink()}
    >
      {children}
    </RouterLink>
  )
}

export default withRouter(SideNavLinkItem)
