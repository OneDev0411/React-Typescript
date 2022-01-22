import { makeStyles, Tooltip } from '@material-ui/core'
import { mdiLightningBolt } from '@mdi/js'
import cn from 'classnames'

import AddToFlowButton from 'components/AddToFlowButton'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import CellContainer from './CellContainer'

const useStyles = makeStyles(
  theme => ({
    button: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,

      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    icon: {
      color: theme.palette.grey[700],
      width: '1em',
      height: '1em',
      marginRight: '0.25rem'
    },
    text: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      '&.hovered': {
        color: theme.palette.tertiary.dark
      },
      '&.selected': {
        color: theme.palette.tertiary.dark
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      }
    }
  }),
  { name: 'Flows-cell' }
)

//----

interface Props {
  contact: IContact
  callback: () => void
  flowsCount: number
  isRowSelected?: boolean
}

const FlowsCell = ({ contact, callback, flowsCount }: Props) => {
  const classes = useStyles()

  const renderCellContent = () => {
    if (flowsCount === 0) {
      return (
        <AddToFlowButton
          contacts={{ ids: [contact.id] }}
          callback={callback}
          buttonRenderer={({ className, ...buttonProps }) => (
            <Tooltip title="Add to flow">
              <span className={cn(className, classes.button)} {...buttonProps}>
                <SvgIcon
                  className={classes.icon}
                  size={muiIconSizes.small}
                  path={mdiLightningBolt}
                />
                +
              </span>
            </Tooltip>
          )}
        />
      )
    }

    return (
      <div className={classes.text}>{`in ${flowsCount} flow${
        flowsCount === 1 ? '' : 's'
      }`}</div>
    )
  }

  return <CellContainer renderCellContent={renderCellContent} />
}

export default FlowsCell
