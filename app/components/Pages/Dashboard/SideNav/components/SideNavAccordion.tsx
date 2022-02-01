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
    name: 'SideNavAccordion'
  }
)

interface SideNavAccordionProps {
  data: any
  onChange: any
  expandedMenu: any
  setExpandedMenu: any
}

export default function SideNavAccordion({
  data,
  onChange,
  expandedMenu,
  setExpandedMenu
}: SideNavAccordionProps) {
  const classes = useStyles()
  const {
    testId = '',
    id,
    label,
    access,
    icon,
    hasChildrenNotification,
    notificationCount,
    to,
    hasDivider,
    subMenu,
    isHidden = false
  } = data

  const childrenRoutes =
    subMenu &&
    subMenu.filter(item => typeof item.to === 'string').map(item => item.to)

  return !isHidden ? (
    <Acl access={access}>
      <SidenavListGroup data-test={testId}>
        <Accordion
          expanded={expandedMenu === `nav-${id}`}
          onChange={onChange(`nav-${id}`)}
          classes={{
            root: classes.accordionRoot,
            expanded: classes.accordionExpanded
          }}
        >
          <AccordionSummary
            aria-controls={`nav-${id}-content`}
            id={`nav-${id}-header`}
            classes={{
              root: classes.accordionSummaryRoot,
              expanded: classes.accordionSummaryRootExpanded,
              content: classes.accordionSummaryContent
            }}
          >
            <SideNavLinkItem
              to={childrenRoutes || to}
              tourId={`nav-${id}`}
              onClick={setExpandedMenu}
              hasSubmenu={subMenu}
              isSubmenu={false}
            >
              <AccordionSummaryDiv>
                {notificationCount ? (
                  <MenuBadge badgeContent={notificationCount} color="primary">
                    <SvgIcon
                      path={icon}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>{label}</AccordionSummaryLabel>
                  </MenuBadge>
                ) : (
                  <>
                    <SvgIcon
                      path={icon}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>
                      {label}
                      {hasChildrenNotification ? <AccordionSummaryDot /> : null}
                    </AccordionSummaryLabel>
                  </>
                )}
              </AccordionSummaryDiv>
              {subMenu ? (
                expandedMenu === `nav-${id}` ? (
                  <SvgIcon path={mdiMenuUp} />
                ) : (
                  <SvgIcon path={mdiMenuDown} />
                )
              ) : null}
            </SideNavLinkItem>
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
                        isSubmenu
                      >
                        {item.notificationCount ? (
                          <MenuBadge
                            badgeContent={item.notificationCount}
                            color="primary"
                          >
                            <SideNavItemLabel>{item.label}</SideNavItemLabel>
                          </MenuBadge>
                        ) : (
                          <SideNavItemLabel>{item.label}</SideNavItemLabel>
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
