import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

import {
  Accordion,
  makeStyles,
  Divider,
  Popper,
  Fade,
  Paper
} from '@material-ui/core'

import Acl from '@app/views/components/Acl'

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
    testId = '',
    id,
    access,
    hasDivider,
    subMenu,
    isHidden = false
  } = data

  const menuId = 'nav-'.concat(id) as ExpandedMenu

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleShowPopper = (event: React.MouseEvent<HTMLElement>, menuId) => {
    setAnchorEl(event.currentTarget)
    setHoveredItem(menuId)
  }

  const handleHidePopper = () => {
    setAnchorEl(null)
    setHoveredItem(null)
  }

  const isOpen = Boolean(anchorEl)
  const popperId = isOpen ? id : undefined

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
            handleShowPopper(event, menuId)
          }
          onMouseLeave={() => subMenu && handleHidePopper()}
          onClick={() => subMenu && handleHidePopper()}
        >
          <SideNavAccordionSummary
            data={data}
            expandedMenu={expandedMenu}
            hoveredItem={hoveredItem}
            menuId={menuId}
            popperId={popperId}
            onExpandedMenu={setExpandedMenu}
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
    </Acl>
  ) : null
}
