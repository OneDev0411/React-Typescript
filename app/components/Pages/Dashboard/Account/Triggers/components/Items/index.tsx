import { CircularProgress, Theme, makeStyles } from '@material-ui/core'

import { useGetGlobalTriggers } from '../../hooks/use-get-global-triggers'

import { Item } from './components/Item'
import { SetupButton } from './components/SetupButton'

const availableGlobalTriggerType: TriggerContactEventTypes[] = [
  'birthday',
  'wedding_anniversary',
  'home_anniversary'
]

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginTop: theme.spacing(2),
      display: 'flex',
      alignItems: 'flex-start'
    },
    item: {
      margin: theme.spacing(1, 3, 0, 0)
    },
    loading: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(4)
    }
  }),
  {
    name: 'GlobalTriggerItems'
  }
)

export function TriggerItems() {
  const classes = useStyles()
  const { isEmpty, isLoading, attrs: globalTriggers } = useGetGlobalTriggers()

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )
    }

    return availableGlobalTriggerType.map(type => {
      if (!isEmpty) {
        const trigger = globalTriggers[type]

        if (trigger) {
          return (
            <div key={trigger.event_type} className={classes.item}>
              <Item trigger={trigger} />
            </div>
          )
        }
      }

      return (
        <div key={type} className={classes.item}>
          <SetupButton setupType={type} />
        </div>
      )
    })
  }

  return <div className={classes.container}>{renderContent()}</div>
}
