import { makeStyles, Theme } from '@material-ui/core'
import { mdiContentCopy, mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

// interface Props {
// value: string
// label: string
// onDelete: () => void
// }

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      display: 'flex',
      padding: theme.spacing(1, 2),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    valueContainer: {},
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.action.disabled
    },
    actionButton: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'AttributeCell'
  }
)

export function Attribute() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.valueContainer}>valueContainer</div>
      <div className={classes.actionContainer}>
        <SvgIcon
          path={mdiContentCopy}
          size={muiIconSizes.small}
          className={classes.actionButton}
        />
        <SvgIcon
          path={mdiTrashCanOutline}
          size={muiIconSizes.small}
          className={classes.actionButton}
        />
      </div>
    </div>
  )
}
