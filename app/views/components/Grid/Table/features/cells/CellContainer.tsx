import { useState } from 'react'

import { makeStyles, alpha, Tooltip, IconButton } from '@material-ui/core'
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
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
      whiteSpace: 'nowrap',
      paddingLeft: theme.spacing(2),
      '&.visibleOverflow': {
        overflow: 'visible'
      }
    },
    inlineViewContainer: {
      display: 'flex',
      overflow: 'hidden',
      gap: theme.spacing(1),
      height: theme.spacing(3.25)
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
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      background: theme.palette.background.paper,
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
  renderCellContent,
  renderInlineEdit = () => <></>,
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

  const renderActionButtons = () => {
    let cellActions: Record<string, CellAction> = {
      edit: {
        tooltipText: 'Edit',
        onClick: toggleEdit,
        iconPath: mdiPencilOutline
      },
      ...omitBy(actions, (v, k) => k === 'delete')
    }

    const renderAction = (name: string, { onClick, iconPath }: CellAction) => (
      <Tooltip
        title={name[0].toUpperCase() + name.slice(1)}
        placement="bottom"
        key={name}
      >
        <IconButton
          className={classes.iconButton}
          size="small"
          onClick={onClick}
        >
          <SvgIcon path={iconPath} size={muiIconSizes.small} />
        </IconButton>
      </Tooltip>
    )

    return (
      <div className={classes.inlineActionIconsContainer}>
        {Object.keys(cellActions).map(name =>
          renderAction(name, cellActions[name])
        )}
      </div>
    )
  }

  //--

  const renderCellOverlay = () => (
    <div
      className={cn(classes.cellOverlay, {
        selected: isSelected
      })}
    >
      {renderActionButtons()}
    </div>
  )
  const renderInlineContent = () => {
    return (
      <>
        {!isEditing && isSelected && actionsActivated && renderCellOverlay()}
        {!isEditing && (
          <div className={classes.inlineViewContainer}>
            {renderCellContent({ isHovered, isSelected })}
          </div>
        )}
        {isEditing && renderInlineEdit()}
      </>
    )
  }

  //--

  return (
    <div
      className={cn(classes.container, {
        visibleOverflow: isEditing
      })}
      onClick={onSelect}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {renderInlineContent()}
    </div>
  )
}

export default CellContainer
