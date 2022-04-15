import { Dispatch, SetStateAction } from 'react'

import { AccordionSummary, Box, makeStyles } from '@material-ui/core'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'

import { MenuBadge } from '@app/views/components/MenuBadge'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { AccordionMenu, ExpandedMenu } from '../types'

import SideNavLinkItem from './SideNavLinkItem'

const useStyles = makeStyles(
  theme => ({
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
    summaryDiv: {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    summaryDot: {
      display: 'inline-block',
      width: '6px',
      height: '6px',
      position: 'absolute',
      right: theme.spacing(2.75),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.error.dark
    },
    summaryLabel: {
      position: 'relative',
      textTransform: 'capitalize'
    },
    summaryIconWrapper: {
      marginRight: theme.spacing(0.5),
      display: 'flex',
      alignItems: 'center'
    },
    iconWrapper: {
      paddingLeft: theme.spacing(0.5),
      display: 'flex',
      alignItems: 'center'
    }
  }),
  {
    name: 'SideNavAccordionSummary'
  }
)

interface Props {
  data: AccordionMenu
  expandedMenu: ExpandedMenu
  hoveredItem: string | null
  menuId: ExpandedMenu
  popperId: string | undefined
  onExpandMenu: Dispatch<SetStateAction<ExpandedMenu>>
}

export function SideNavAccordionSummary({
  data,
  expandedMenu,
  hoveredItem,
  menuId,
  popperId,
  onExpandMenu
}: Props) {
  const classes = useStyles()
  const {
    action,
    label,
    icon = '',
    hasChildrenNotification,
    notificationCount,
    to = '',
    subMenu
  } = data

  const menuIconWrapper = (
    <>
      {(hoveredItem !== menuId || !subMenu) && (
        <Box className={classes.iconWrapper}>
          <SvgIcon path={icon} size={muiIconSizes.small} rightMargined />
        </Box>
      )}
      <Box className={classes.summaryLabel}>{label}</Box>
    </>
  )

  return (
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
        onExpandMenu={onExpandMenu}
        subMenu={subMenu}
      >
        <Box className={classes.summaryDiv}>
          {subMenu && hoveredItem === menuId ? (
            <Box className={classes.summaryIconWrapper}>
              {expandedMenu === menuId ? (
                <SvgIcon path={mdiChevronUp} />
              ) : (
                <SvgIcon path={mdiChevronDown} />
              )}
            </Box>
          ) : null}

          {notificationCount ? (
            <MenuBadge badgeContent={notificationCount} max={9}>
              {menuIconWrapper}
            </MenuBadge>
          ) : (
            <>
              {menuIconWrapper}
              {hasChildrenNotification ? (
                <Box className={classes.summaryDot} />
              ) : null}
            </>
          )}
        </Box>
      </SideNavLinkItem>
    </AccordionSummary>
  )
}
