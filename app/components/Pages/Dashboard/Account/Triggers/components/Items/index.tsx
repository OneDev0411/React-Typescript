import { useMemo } from 'react'

import { Theme, makeStyles } from '@material-ui/core'

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
    }
  }),
  {
    name: 'GlobalTriggerItems'
  }
)

interface Props {
  list: Nullable<IGlobalTrigger[]>
  onSetupCallback: () => void
}

export function TriggerItems({ list, onSetupCallback }: Props) {
  const classes = useStyles()

  const activeTriggers = useMemo(
    () => (list || []).map(trigger => trigger.event_type),
    [list]
  )
  const renderItem = () => {
    return availableGlobalTriggerType.map(type => {
      if (list && list?.length > 0) {
        const trigger = list[activeTriggers.indexOf(type)]

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
          <SetupButton setupType={type} onSetupCallback={onSetupCallback} />
        </div>
      )
    })
  }

  return <div className={classes.container}>{renderItem()}</div>
}
