import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
  Divider,
  Popper,
  Fade,
  Paper
} from '@material-ui/core'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'

import Acl from '@app/views/components/Acl'
import { MenuBadge } from '@app/views/components/MenuBadge'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import {
  AccordionSummaryDiv,
  AccordionSummaryDot,
  AccordionSummaryLabel,
  SideNavItemLabel,
  SidenavListGroup,
  IconWrapper,
  AccordionSummaryIconWrapper
} from '../styled'
import { AccordionMenu, ExpandedMenu } from '../types'

import SideNavLinkItem from './SideNavLinkItem'

const useStyles = makeStyles(
  theme => ({
    divider: {
      backgroundColor: theme.palette.grey[800],
      margin: theme.spacing(0.75, 0)
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
      margin: theme.spacing(0, 1, 0, 0),
      padding: 0,
      flexDirection: 'column'
    },
    popper: {
      zIndex: 101,
      overflow: 'hidden',
      borderRadius: theme.spacing(
        0,
        `${theme.shape.borderRadius}px`,
        `${theme.shape.borderRadius}px`,
        0
      )
    },
    paper: {
      backgroundColor: theme.palette.tertiary.light,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),

      '& a': {
        color: theme.palette.common.white,
        minWidth: `${theme.spacing(18)}px`,
        paddingLeft: theme.spacing(2)
      }
    }
  }),
  {
    name: 'SideNavAccordion'
  }
)

interface SideNavAccordionProps {
  data: AccordionMenu
  expandedMenu: ExpandedMenu
  onChange: (
    panel: ExpandedMenu
  ) => (event: ChangeEvent<{}>, isExpanded: boolean) => void
  setExpandedMenu: Dispatch<SetStateAction<ExpandedMenu>>
}

export default function SideNavAccordion({
  data,
  expandedMenu,
  onChange,
  setExpandedMenu
}: SideNavAccordionProps) {
  const classes = useStyles()
  const {
    action,
    testId = '',
    id,
    label,
    access,
    icon = '',
    hasChildrenNotification,
    notificationCount,
    to = '',
    hasDivider,
    subMenu,
    isHidden = false
  } = data

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const menuId = 'nav-'.concat(id) as ExpandedMenu

  const menuIconWrapper = (
    <>
      {(hoveredItem !== menuId || !subMenu) && (
        <IconWrapper>
          <SvgIcon path={icon} size={muiIconSizes.small} rightMargined />
        </IconWrapper>
      )}
      <AccordionSummaryLabel>{label}</AccordionSummaryLabel>
    </>
  )

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleHoverPopper = (event: React.MouseEvent<HTMLElement>, menuId) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    setHoveredItem(menuId || null)
  }

  const open = Boolean(anchorEl)
  const popperId = open ? id : undefined

  return !isHidden ? (
    <Acl access={access}>
      <SidenavListGroup data-test={testId}>
        <Accordion
          expanded={expandedMenu === menuId}
          onChange={onChange(menuId)}
          classes={{
            root: classes.accordionRoot,
            expanded: classes.accordionExpanded
          }}
          onMouseEnter={event =>
            subMenu &&
            expandedMenu !== menuId &&
            handleHoverPopper(event, menuId)
          }
          onMouseLeave={() => subMenu && setAnchorEl(null)}
          onClick={() => subMenu && setAnchorEl(null)}
        >
          <AccordionSummary
            aria-controls={`${menuId}-content`}
            aria-describedby={popperId}
            id={`${menuId}-header`}
            classes={{
              root: classes.accordionSummaryRoot,
              expanded: classes.accordionSummaryRootExpanded,
              content: classes.accordionSummaryContent
            }}
          >
            <SideNavLinkItem
              onTriggerAction={action}
              to={to || subMenu?.[0]?.to}
              tourId={menuId}
              onExpandedMenu={setExpandedMenu}
              subMenu={subMenu}
            >
              <AccordionSummaryDiv>
                {subMenu && hoveredItem === menuId ? (
                  <AccordionSummaryIconWrapper>
                    {expandedMenu === menuId ? (
                      <SvgIcon path={mdiChevronUp} />
                    ) : (
                      <SvgIcon path={mdiChevronDown} />
                    )}
                  </AccordionSummaryIconWrapper>
                ) : null}

                {notificationCount ? (
                  <MenuBadge badgeContent={notificationCount} max={9}>
                    {menuIconWrapper}
                  </MenuBadge>
                ) : (
                  <>
                    {menuIconWrapper}
                    {hasChildrenNotification ? <AccordionSummaryDot /> : null}
                  </>
                )}
              </AccordionSummaryDiv>
            </SideNavLinkItem>
          </AccordionSummary>

          {subMenu &&
            (open ? (
              <Popper
                className={classes.popper}
                id={popperId}
                open={open}
                anchorEl={anchorEl}
                placement="right-start"
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                      <div className={classes.paper}>
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
                                        {item.label}
                                      </MenuBadge>
                                    ) : (
                                      item.label
                                    )}
                                  </SideNavLinkItem>
                                </Acl>
                              )
                          )}
                        </AccordionDetails>
                      </div>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            ) : (
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
            ))}
        </Accordion>

        {hasDivider && <Divider className={classes.divider} />}
      </SidenavListGroup>
    </Acl>
  ) : null
}
