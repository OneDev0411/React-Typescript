import { useState } from 'react'

import {
  makeStyles,
  alpha,
  Tooltip,
  IconButton,
  Popover
} from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import cn from 'classnames'
import { omitBy } from 'lodash'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { CellProps } from '../../types'

//----

export interface CellAction {
  tooltipText?: string
  onClick: (e: any) => void
  iconPath: string
}

interface Props {
  text?: string
  isEmpty?: boolean
  isSelectable?: boolean
  actionsActivated?: boolean
  renderInlineEdit?: () => React.ReactNode
  renderCellContent: (props: CellProps) => React.ReactNode
  onCellSelect?: (e) => void
  onEnterEdit?: (isEditing: boolean) => void
  actions?: Record<string, CellAction>
}

//----

const useStyles = makeStyles(
  theme => ({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRight: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      whiteSpace: 'nowrap',
      '&.visibleOverflow': {
        overflow: 'visible'
      }
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
      paddingRight: theme.spacing(1),

      '&.selected': {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.spacing(0.5),
        boxSizing: 'border-box'
      }
    },
    inlineActionIconsContainer: () => ({
      position: 'relative',
      display: 'flex',
      gap: theme.spacing(1),

      '&.hidden': {
        visibility: 'hidden'
      },
      '&.visible': {
        visibility: 'visible'
      }
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

//----

const CellContainer = ({
  actionsActivated = false,
  isEmpty = true,
  isSelectable = false,
  renderCellContent,
  renderInlineEdit,
  actions = {}
}: Props) => {
  const classes = useStyles()

  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const onSelect = () => {
    if (!isEditing) {
      setIsSelected(true)
    }
  }
  const onHoverIn = () => setIsHovered(true)
  const onHoverOut = () => setIsHovered(false)
  const toggleEdit = () => {
    setIsEditing(true)
  }

  //--

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
          selected: isSelected
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

      const id = isEditing ? 'inline-edit-popover' : undefined

      return (
        <Popover
          id={id}
          open={isEditing}
          anchorReference="anchorPosition"
          anchorPosition={{ top: -10, left: -10 }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left'
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          {renderInlineEdit()}
        </Popover>
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

  //--

  return (
    <div
      className={cn(classes.container, {
        visibleOverflow: isEditing
      })}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      {...(isSelectable ? { onClick: onSelect } : {})}
    >
      {InlineContent()}
    </div>
  )
}

export default CellContainer
