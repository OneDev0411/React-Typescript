import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
  Divider
} from '@material-ui/core'
import { mdiMenuUp, mdiMenuDown } from '@mdi/js'

import Acl from '@app/views/components/Acl'
import { MenuBadge } from '@app/views/components/MenuBadge'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import {
  AccordionSummaryDiv,
  AccordionSummaryDot,
  AccordionSummaryLabel,
  SideNavItemLabel,
  SidenavListGroup
} from '../styled'

import SideNavLinkItem from './SideNavLinkItem'
import SideNavLinkSummary from './SideNavLinkSummary'

const useStyles = makeStyles(
  theme => ({
    divider: {
      backgroundColor: theme.palette.grey[800],
      margin: theme.spacing(0.75, 1)
    },
    accordionRoot: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      '&:before': {
        height: '0'
      }
    },
    accordionExpanded: {
      // I had to add !important to force accordion styles to change
      margin: '0 !important'
    },
    accordionSummaryRoot: {
      padding: 0,
      // I had to add !important to force accordionSummary styles to change
      minHeight: `${theme.spacing(5.5)}px !important`
    },
    accordionSummaryRootExpanded: {
      // Added primary color to the root menu's svg-icon, when it is expanded
      '& svg:first-child': {
        color: theme.palette.primary.main
      }
    },
    accordionSummaryContent: {
      display: 'flex',
      justifyContent: 'flex-start',
      // I had to add !important to force accordionSummary styles to change
      margin: '0 !important'
    },
    AccordionDetailsRoot: {
      padding: 0,
      flexDirection: 'column'
    }
  }),
  {
    name: 'AccordionMenu'
  }
)

interface AccordionMenuProps {
  data: any
  onChange: any
  expandedMenu: any
  setExpandedMenu: any
}

export default function AccordionMenu({
  data,
  onChange,
  expandedMenu,
  setExpandedMenu
}: AccordionMenuProps) {
  const classes = useStyles()
  const {
    testId,
    label,
    access,
    icon,
    hasChildrenNotification,
    notifCount,
    to,
    hasDivider,
    subMenu,
    isHidden
  } = data

  const childrenRoutes =
    subMenu &&
    subMenu.filter(item => typeof item.to === 'string').map(item => item.to)

  return !isHidden ? (
    <Acl access={access}>
      <SidenavListGroup data-test={testId}>
        <Accordion
          expanded={expandedMenu === `nav-${label}`}
          onChange={onChange(`nav-${label}`)}
          classes={{
            root: classes.accordionRoot,
            expanded: classes.accordionExpanded
          }}
        >
          <AccordionSummary
            aria-controls={`nav-${label}-content`}
            id={`nav-${label}-header`}
            classes={{
              root: classes.accordionSummaryRoot,
              expanded: classes.accordionSummaryRootExpanded,
              content: classes.accordionSummaryContent
            }}
          >
            <SideNavLinkSummary
              to={childrenRoutes || to}
              tourId={`nav-${label}`}
              onClick={setExpandedMenu}
            >
              <AccordionSummaryDiv>
                {notifCount ? (
                  <MenuBadge badgeContent={notifCount} color="primary">
                    <SvgIcon
                      path={icon}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>
                      {label.replaceAll('-', ' ')}
                    </AccordionSummaryLabel>
                  </MenuBadge>
                ) : (
                  <>
                    <SvgIcon
                      path={icon}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>
                      {label.replaceAll('-', ' ')}
                      {hasChildrenNotification ? <AccordionSummaryDot /> : null}
                    </AccordionSummaryLabel>
                  </>
                )}
              </AccordionSummaryDiv>
              {subMenu ? (
                expandedMenu === `nav-${label}` ? (
                  <SvgIcon path={mdiMenuUp} />
                ) : (
                  <SvgIcon path={mdiMenuDown} />
                )
              ) : null}
            </SideNavLinkSummary>
          </AccordionSummary>

          {subMenu && (
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
                        to={item.to}
                        tourId={`nav-${item.label}`}
                      >
                        {item.notifCount ? (
                          <MenuBadge
                            badgeContent={item.notifCount}
                            color="primary"
                          >
                            <SideNavItemLabel>
                              {item.label.replaceAll('-', ' ')}
                            </SideNavItemLabel>
                          </MenuBadge>
                        ) : (
                          <SideNavItemLabel>
                            {item.label.replaceAll('-', ' ')}
                          </SideNavItemLabel>
                        )}
                      </SideNavLinkItem>
                    </Acl>
                  )
              )}
            </AccordionDetails>
          )}
        </Accordion>

        {hasDivider && <Divider className={classes.divider} />}
      </SidenavListGroup>
    </Acl>
  ) : null
}
