import { Dispatch, MouseEvent, SetStateAction, useState } from 'react'

import {
  Accordion,
  makeStyles,
  Divider,
  Popper,
  Fade,
  Paper
} from '@material-ui/core'

import { SidenavListGroup } from '../styled'
import { AccordionMenu, ExpandedMenu } from '../types'

import { SideNavAccordionDetails } from './SideNavAccordionDetails'
import { SideNavAccordionSummary } from './SideNavAccordionSummary'

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

      // I had to add element name to change accordionSummary styles because couldn't find proper class-name
      '& a': {
        color: theme.palette.common.white,
        minWidth: `${theme.spacing(18)}px`,
        paddingLeft: theme.spacing(2)
      }
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

  const menuId = 'nav-'.concat(id) as ExpandedMenu

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isOpen = Boolean(anchorEl)
  const popperId = isOpen ? id : undefined

  const handleShowPopper = (event: MouseEvent<HTMLElement>) => {
    if (!subMenu || expandedMenu === menuId) {
      return
    }

    setAnchorEl(event.currentTarget)
    setHoveredItem(menuId)
  }

  const handleHidePopper = () => {
    if (!subMenu) {
      return
    }

    setAnchorEl(null)
    setHoveredItem(null)
  }

  const handleClick = () => {
    if (!subMenu || expandedMenu === menuId) {
      return
    }

    handleHidePopper()
    onExpandMenu(menuId)
  }

  return (
    <SidenavListGroup data-test={testId}>
      <Accordion
        expanded={expandedMenu === menuId}
        classes={{
          root: classes.accordionRoot,
          expanded: classes.accordionExpanded
        }}
        onMouseEnter={event => handleShowPopper(event)}
        onMouseLeave={() => handleHidePopper()}
        onClick={() => handleClick()}
      >
        <SideNavAccordionSummary
          data={data}
          expandedMenu={expandedMenu}
          hoveredItem={hoveredItem}
          menuId={menuId}
          popperId={popperId}
          onExpandMenu={onExpandMenu}
        />

        {subMenu &&
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
                        subMenu={subMenu}
                      />
                    </div>
                  </Paper>
                </Fade>
              )}
            </Popper>
          ) : (
            <SideNavAccordionDetails isOpen={isOpen} subMenu={subMenu} />
          ))}
      </Accordion>

      {hasDivider && <Divider className={classes.divider} />}
    </SidenavListGroup>
  )
}
