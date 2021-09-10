import { useMemo } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useTitle, useEffectOnce } from 'react-use'

import useAsync from '@app/hooks/use-async'
import { getTriggers } from '@app/models/instant-marketing/global-triggers'
import { selectActiveBrandId } from '@app/selectors/brand'

import { ActivateButtons } from './components/ActivateButtons'
import { TriggerItem } from './components/Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    description: {
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'GlobalTrigger' }
)

interface Props {}

export default function Triggers(props: Props) {
  useTitle('Trigger | Settings | Rechat')

  const classes = useStyles()
  const brandId = useSelector(selectActiveBrandId)
  const { isLoading, data: triggers, run } = useAsync<IGlobalTrigger[]>()

  const activeTriggers = useMemo(
    () => (triggers || []).map(trigger => trigger.event_type),
    [triggers]
  )

  useEffectOnce(() => {
    run(() => getTriggers(brandId))
  })
  console.log({ isLoading, triggers })

  return (
    <>
      <Typography variant="subtitle1">
        Send Birthday and Anniversary Email Automatically
      </Typography>
      <Typography variant="body2" className={classes.description}>
        Your contacts will receive an email on their birthdays and
        anniversaries. It is possible to opt out contacts or change the template
        in their profile.
      </Typography>
      <ActivateButtons activeTriggers={activeTriggers} />
      <TriggerItem data={triggers} />
    </>
  )
}
