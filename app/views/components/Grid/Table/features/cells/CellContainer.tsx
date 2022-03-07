import { useRef, useState } from 'react'

import {
  makeStyles,
  alpha,
  Tooltip,
  IconButton,
  Popper,
  Fade,
  ClickAwayListener
} from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import cn from 'classnames'
import { omitBy } from 'lodash'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { CellProps } from '../../types'

export interface CellAction {
  tooltipText?: string
  onClick: (e: any) => void
  iconPath: string
}

interface Props {
  text?: string
  isEmpty?: boolean
  rowSize?: number | string
  isSelectable?: boolean
  actionsActivated?: boolean
  renderInlineEdit?: () => React.ReactElement
  renderCellContent: (props: CellProps) => React.ReactNode
  onCellSelect?: (e) => void
  actions?: Record<string, CellAction>
  width: number | string
  stopPropagation?: boolean // temporary till phase 2
}

const useStyles = makeStyles(
  theme => ({
    container: ({ width }: { width: number | string }) => ({
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      width,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRight: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      whiteSpace: 'nowrap'
    }),
    visibleOverflow: {
      overflow: 'visible'
    },
    inlineViewContainer: {
      display: 'flex',
      overflow: 'hidden',
      gap: theme.spacing(1),
      height: theme.spacing(3.25),
      marginLeft: theme.spacing(2)
    },
    cellOverlay: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',
      paddingRight: theme.spacing(1)
    },
    cellOverlaySelected: {
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      boxSizing: 'border-box'
    },
    inlineActionIconsContainer: () => ({
      position: 'relative',
      display: 'flex',
      gap: theme.spacing(1)
    }),
    iconButton: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderRadius: theme.spacing(4),
      boxSizing: 'border-box',
      boxShadow: `
        0px 0.1px 0.3px ${alpha(theme.palette.tertiary.dark, 0.1)}, 
        0px 1px 2px ${alpha(theme.palette.tertiary.dark, 0.2)} !important
      `,
      '&:hover': {
        backgroundColor: theme.palette.grey['200']
      }
    }
  }),
  { name: 'CellContainer' }
)

export const CellContainer = ({
  actionsActivated = false,
  isEmpty = true,
  isSelectable = false,
  renderCellContent,
  renderInlineEdit,
  rowSize = '40px',
  actions = {},
  width,
  stopPropagation = false
}: Props) => {
  const classes = useStyles({ width })

  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const anchorRef = useRef<HTMLDivElement>(null)

  const onSelect = () => {
    if (!isEditing) {
      setIsSelected(true)
    }
  }
  const onHoverIn = () => setIsHovered(true)
  const onHoverOut = () => setIsHovered(false)

  const toggleEdit = () => setIsEditing(prev => !prev)

  const onClickAway = () => {
    setIsSelected(false)
    setIsEditing(false)
  }

  const InlineContent = () => {
    const Action = (
      name: string,
      { onClick, iconPath, tooltipText = '' }: CellAction
    ) => (
      <Tooltip title={tooltipText} placement="bottom" key={name}>
        <IconButton
          className={classes.iconButton}
          size="small"
          onClick={onClick}
        >
          <SvgIcon path={iconPath} size={muiIconSizes.small} />
        </IconButton>
      </Tooltip>
    )

    const cellActions: Record<string, CellAction> = {
      edit: {
        tooltipText: 'Edit',
        onClick: toggleEdit,
        iconPath: mdiPencilOutline
      },
      ...(isEmpty ? {} : omitBy(actions, (v, k) => k === 'delete'))
    }

    const CellOverlay = () => (
      <div
        className={cn(classes.cellOverlay, {
          [classes.cellOverlaySelected]: isSelected
        })}
      >
        <div className={classes.inlineActionIconsContainer}>
          {Object.keys(cellActions).map(name =>
            Action(name, cellActions[name])
          )}
        </div>
      </div>
    )

    const InlineEdit = () => {
      if (!renderInlineEdit) {
        return null
      }

      return (
        <Popper
          open={isEditing}
          anchorEl={anchorRef.current}
          transition
          placement="bottom-start"
          modifiers={{
            offset: {
              enabled: true,
              offset: `0, -${rowSize}`
            },
            flip: {
              enabled: false
            }
          }}
        >
          {({ TransitionProps, placement }) => (
            <Fade
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              {renderInlineEdit()}
            </Fade>
          )}
        </Popper>
      )
    }

    return (
      <>
        {!isEditing && isSelected && actionsActivated && CellOverlay()}
        {!isEditing && (
          <div className={classes.inlineViewContainer}>
            {renderCellContent({ isHovered, isSelected })}
          </div>
        )}
        {isEditing && InlineEdit()}
      </>
    )
  }

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div
        ref={anchorRef}
        className={cn(classes.container, {
          [classes.visibleOverflow]: isEditing
        })}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        {...(isSelectable ? { onClick: onSelect } : {})}
      >
        {InlineContent()}
      </div>
    </ClickAwayListener>
  )
}
