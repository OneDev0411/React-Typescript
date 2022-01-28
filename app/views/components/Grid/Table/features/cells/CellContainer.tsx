import { useState } from 'react'

import { makeStyles, alpha } from '@material-ui/core'
import cn from 'classnames'

import { CellProps } from '../../types'

//----

interface Props {
  text?: string
  renderCellContent: (props: CellProps) => React.ReactNode
  onCellSelect?: (e) => void
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
      borderBottom: `1px solid ${theme.palette.divider}`,
      whiteSpace: 'nowrap',
      paddingLeft: theme.spacing(2)
    },
    inlineViewContainer: {
      display: 'flex',
      overflow: 'hidden',
      gap: theme.spacing(1),
      height: theme.spacing(3)
    },
    cellOverlay: {
      display: 'none',
      position: 'absolute',
      height: '100%',
      width: '100%',

      '&.selected': {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.spacing(0.5),
        boxSizing: 'border-box'
      }
    }
  }),
  { name: 'CellContainer' }
)

//----

const CellContainer = ({ renderCellContent }: Props) => {
  const classes = useStyles()

  const [isHovered, setIsHovered] = useState(false)
  const isSelected = false

  const onHoverIn = () => setIsHovered(true)
  const onHoverOut = () => setIsHovered(false)

  //--

  const renderCellOverlay = () => (
    <div
      className={cn(classes.cellOverlay, {
        selected: isSelected
      })}
    />
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
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {renderInlineContent()}
    </div>
  )
}

export default CellContainer
