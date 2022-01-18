import { MouseEvent, useState } from 'react'

import { makeStyles, IconButton, Tooltip } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { RenderProps } from '../../types'

//----

interface StyleProps {
  isHovered?: boolean
}
interface Action {
  tooltipText?: string
  onClick: (e: any) => void
  iconPath: string
}
interface Props<Row> {
  text?: string
  enableActions?: boolean
  renderInlineEdit?: (
    data: RenderProps<Row>,
    close: (e: MouseEvent<HTMLButtonElement>) => void
  ) => React.ReactNode
  renderCellContent: () => JSX.Element
  onEnterEdit?: (isEditing: boolean) => void
  actions?: Record<string, Action>
}

//----

const useStyles = makeStyles(
  theme => ({
    container: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    inlineViewContainer: {
      position: 'relative',
      padding: theme.spacing(1, 0, 1, 2),
      overflow: 'hidden',
      height: '100%',
      '& > div': {
        height: '25px',
        display: 'inline-block',
        overflow: 'hidden'
      }
    },
    inlineActionIconsContainer: ({ isHovered }: StyleProps) => ({
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      visibility: isHovered ? 'visible' : 'hidden'
    })
  }),
  { name: 'CellContainer' }
)

//----

const CellContainer = ({
  enableActions = true,
  renderCellContent,
  renderInlineEdit,
  onEnterEdit,
  actions = {}
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const classes = useStyles({ isHovered })

  let actionContent

  if (enableActions) {
    let cellActions: Record<string, Action> = {
      edit: {
        tooltipText: 'Edit',
        onClick: e => {
          e.stopPropagation()

          setIsEditing(!isEditing)
          onEnterEdit!(!isEditing)
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

    actionContent = (
      <div className={classes.inlineActionIconsContainer}>
        {Object.keys(cellActions).map(name =>
          renderAction(name, cellActions[name])
        )}
      </div>
    )
  }

  const cellContent = renderCellContent()
  const renderInlineContent = () => {
    return (
      <div
        className={classes.inlineViewContainer}
        onMouseEnter={e => setIsHovered(true)}
        onMouseLeave={e => setIsHovered(false)}
      >
        {cellContent}
        {actionContent}
      </div>
    )
  }

  return (
    <div className={classes.container}>
      {isEditing && renderInlineEdit!()}
      {!isEditing && renderInlineContent()}
    </div>
  )
}

export default CellContainer
