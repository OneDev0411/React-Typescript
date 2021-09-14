import { Typography, Theme, makeStyles } from '@material-ui/core'

import { Item } from './components/Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginTop: theme.spacing(3)
    },
    title: {
      marginBottom: theme.spacing(1.5)
    },
    itemContainer: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    item: {
      margin: theme.spacing(1, 3, 0, 0)
    }
  }),
  {
    name: 'GlobalTriggerItems'
  }
)

interface Props {
  list: Nullable<IGlobalTrigger[]>
}

export function TriggerItems({ list }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Typography variant="subtitle2" className={classes.title}>
        Default Templates
      </Typography>
      <div className={classes.itemContainer}>
        {list?.map(trigger => (
          <div key={trigger.event_type} className={classes.item}>
            <Item trigger={trigger} />
          </div>
        ))}
      </div>
    </div>
  )
}
