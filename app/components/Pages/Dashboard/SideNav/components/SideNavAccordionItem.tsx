import { Dispatch, MouseEvent, SetStateAction, useState } from 'react'

import {
  Accordion,
  makeStyles,
  Divider,
  Popper,
  Fade,
  Paper
} from '@material-ui/core'

import { AccordionMenu, ExpandedMenu } from '../types'

import { SideNavAccordionDetails } from './SideNavAccordionDetails'
import { SideNavAccordionSummary } from './SideNavAccordionSummary'

const useStyles = makeStyles(
  theme => ({
    accordionExpanded: {
      // I had to add !important to force accordion styles to change
      margin: '0 !important'
    },
    accordionRoot: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      '&:before': {
        height: 0
      }
    },
    divider: {
      backgroundColor: theme.palette.grey[800],
      margin: theme.spacing(0.75, 0)
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      margin: 0,
      padding: 0
    },
    paper: {
      backgroundColor: theme.palette.background.default,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),

      // I had to add element name to change accordionSummary styles because couldn't find proper class-name
      '& a': {
        color: theme.palette.common.black,
        minWidth: `${theme.spacing(18)}px`,
        paddingLeft: theme.spacing(2),

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.common.black
        }
      }
    },
    popper: {
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      border: `1px solid ${theme.palette.grey[200]}`,
      marginLeft: theme.spacing(-0.5),
      overflow: 'hidden',
      zIndex: theme.zIndex.sideNavDrawer
    }
  }),
  {
    name: 'SideNavAccordionItem'
  }
)

interface SideNavAccordionItemProps {
  data: AccordionMenu
  expandedMenu: ExpandedMenu
  onExpandMenu: Dispatch<SetStateAction<ExpandedMenu>>
}

export default function SideNavAccordionItem({
  data,
  expandedMenu,
  onExpandMenu
}: SideNavAccordionItemProps) {
  const classes = useStyles()
  const { testId = '', id, hasDivider, subMenu } = data

  const filteredSubMenu = subMenu?.filter(menu => !menu.isHidden)

  const menuId = 'nav-'.concat(id) as ExpandedMenu

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isOpen = Boolean(anchorEl)
  const popperId = isOpen ? id : undefined

  const handleShowPopper = (event: MouseEvent<HTMLElement>) => {
    if (!filteredSubMenu || expandedMenu === menuId) {
      return
    }

    setAnchorEl(event.currentTarget)
    setHoveredItem(menuId)
  }

  const handleHidePopper = () => {
    if (!filteredSubMenu) {
      return
    }

    setAnchorEl(null)
    setHoveredItem(null)
  }

  const handleClick = () => {
    if (!filteredSubMenu || expandedMenu === menuId) {
      return
    }

    handleHidePopper()
    onExpandMenu(menuId)
  }

  return (
    <div className={classes.list} data-test={testId}>
      <Accordion
        expanded={expandedMenu === menuId}
        classes={{
          root: classes.accordionRoot,
          expanded: classes.accordionExpanded
        }}
        onMouseEnter={handleShowPopper}
        onMouseLeave={handleHidePopper}
        onClick={handleClick}
      >
        <SideNavAccordionSummary
          data={{ ...data, subMenu: filteredSubMenu }}
          expandedMenu={expandedMenu}
          hoveredItem={hoveredItem}
          menuId={menuId}
          popperId={popperId}
          onExpandMenu={onExpandMenu}
        />

        {filteredSubMenu &&
          (isOpen ? (
            <Popper
              className={classes.popper}
              id={popperId}
              open={isOpen}
              anchorEl={anchorEl}
              placement="right-start"
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={0}>
                  <Paper>
                    <div className={classes.paper}>
                      <SideNavAccordionDetails
                        isOpen={isOpen}
                        subMenu={filteredSubMenu}
                      />
                    </div>
                  </Paper>
                </Fade>
              )}
            </Popper>
          ) : (
            <SideNavAccordionDetails
              isOpen={isOpen}
              subMenu={filteredSubMenu}
            />
          ))}
      </Accordion>

      {hasDivider && <Divider className={classes.divider} />}
    </div>
  )
}
