import { makeStyles, Theme } from '@material-ui/core'

import { muiIconSizes } from '@app/views/components/SvgIcons'
import { eventTypesIcons } from '@app/views/utils/event-types-icons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    type: {
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'Tasks-TaskTypeCell'
  }
)

interface Props {
  type: CRMTaskTypes
}

export function TaskTypeCell({ type }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {eventTypesIcons[type].icon({
        size: muiIconSizes.small
      })}

      <div className={classes.type}>{type}</div>
    </div>
  )
}
