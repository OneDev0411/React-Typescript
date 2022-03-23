import { AccordionDetails, makeStyles } from '@material-ui/core'

import Acl from '@app/views/components/Acl'
import { MenuBadge } from '@app/views/components/MenuBadge'

import { SideNavItemLabel } from '../styled'
import { AccordionSubMenu, ExpandedMenu } from '../types'

import SideNavLinkItem from './SideNavLinkItem'

const useStyles = makeStyles(
  theme => ({
    AccordionDetailsRoot: {
      margin: theme.spacing(0, 1, 0, 0),
      padding: 0,
      flexDirection: 'column'
    }
  }),
  {
    name: 'SideNavAccordionDetails'
  }
)

interface Props {
  isOpen: boolean
  subMenu: AccordionSubMenu[]
}

export function SideNavAccordionDetails({ isOpen, subMenu }: Props) {
  const classes = useStyles()

  return (
    <AccordionDetails
      classes={{
        root: classes.AccordionDetailsRoot
      }}
    >
      {subMenu.map(
        (item, index) =>
          !item.isHidden && (
            <Acl access={item.access} key={index}>
              <SideNavLinkItem
                onTriggerAction={item.action}
                to={item.to}
                tourId={`nav-${item.id}` as ExpandedMenu}
                isSubmenu
              >
                {item.notificationCount ? (
                  <MenuBadge
                    badgeContent={item.notificationCount}
                    color="primary"
                    max={9}
                  >
                    {isOpen ? (
                      item.label
                    ) : (
                      <SideNavItemLabel>{item.label}</SideNavItemLabel>
                    )}
                  </MenuBadge>
                ) : isOpen ? (
                  item.label
                ) : (
                  <SideNavItemLabel>{item.label}</SideNavItemLabel>
                )}
              </SideNavLinkItem>
            </Acl>
          )
      )}
    </AccordionDetails>
  )
}
