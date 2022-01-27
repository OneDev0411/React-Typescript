import { useState } from 'react'

import { makeStyles, alpha, Tooltip, IconButton } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { CellProps } from '../../types'

//----

interface Action {
  tooltipText?: string
  onClick: (e: any) => void
  iconPath: string
}
interface Props {
  text?: string
  actionsActivated?: boolean
  renderInlineEdit?: () => JSX.Element
  renderCellContent: (props: CellProps) => React.ReactNode
  onCellSelect?: (e) => void
  onEnterEdit?: (isEditing: boolean) => void
  actions?: Record<string, Action>
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
      paddingLeft: theme.spacing(2)
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

      '&.selected': {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.spacing(0.5),
        boxSizing: 'border-box'
      }
    },
    inlineActionIconsContainer: () => ({
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translate(-50%, -50%)',

      '&.hidden': {
        visibility: 'hidden'
      },
      '&.visible': {
        visibility: 'visible'
      }
    })
  }),
  { name: 'CellContainer' }
)

//----

const CellContainer = ({
  actionsActivated = false,
  renderCellContent,
  renderInlineEdit,
  onEnterEdit,
  actions = {}
}: Props) => {
  const classes = useStyles()

  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const onSelect = () => {
    setIsSelected(!isSelected)
  }

  const onHoverIn = () => setIsHovered(true)
  const onHoverOut = () => setIsHovered(false)

  //--

  const renderActionContent = () => {
    let cellActions: Record<string, Action> = {
      edit: {
        tooltipText: 'Edit',
        onClick: e => {
          e.stopPropagation()

          const _isEditing = !isEditing

          setIsEditing(_isEditing)
          onEnterEdit!(_isEditing)
        },
        iconPath: mdiPencilOutline
      },
      ...actions
    }

    const renderAction = (name: string, { onClick, iconPath }: Action) => (
      <Tooltip
        title={name[0].toUpperCase() + name.slice(1)}
        placement="bottom"
        key={name}
      >
        <IconButton size="small" onClick={onClick}>
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
      {actionsActivated && isSelected && renderActionContent()}
    </div>
  )
  const renderInlineContent = () => (
    <>
      {renderCellOverlay()}
      <div className={classes.inlineViewContainer}>
        {renderCellContent({ isHovered, isSelected })}
      </div>
    </>
  )

  //--

  return (
    <div
      className={classes.container}
      onClick={onSelect}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {renderInlineContent()}
    </div>
  )
}

export default CellContainer
