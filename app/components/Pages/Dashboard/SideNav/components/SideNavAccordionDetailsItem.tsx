import { makeStyles } from '@material-ui/core'

import { MenuBadge } from '@app/views/components/MenuBadge'

import { BaseAccordionMenu, ExpandedMenu } from '../types'

import SideNavLinkItem from './SideNavLinkItem'

const useStyles = makeStyles(
  theme => ({
    label: {
      paddingLeft: theme.spacing(3)
    }
  }),
  {
    name: 'SideNavAccordionDetailsItem'
  }
)

interface Props {
  isOpen: boolean
  item: BaseAccordionMenu
}

export function SideNavAccordionDetailsItem({ isOpen, item }: Props) {
  const classes = useStyles()

  return (
    <SideNavLinkItem
      onTriggerAction={item.action}
      to={item.to}
      tourId={`nav-${item.id}` as ExpandedMenu}
      isSubmenu
    >
      <MenuBadge badgeContent={item.notificationCount} color="primary" max={9}>
        {isOpen ? (
          item.label
        ) : (
          <div className={classes.label}>{item.label}</div>
        )}
      </MenuBadge>
    </SideNavLinkItem>
  )
}
