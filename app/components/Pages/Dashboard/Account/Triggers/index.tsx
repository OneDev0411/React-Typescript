import { useCallback } from 'react'

import {
  CircularProgress,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useTitle, useEffectOnce } from 'react-use'

import useAsync from '@app/hooks/use-async'
import { getTriggers } from '@app/models/instant-marketing/global-triggers'
import { selectActiveBrandId } from '@app/selectors/brand'

import { TriggerItems } from './components/Items'

const useStyles = makeStyles(
  (theme: Theme) => ({
    description: {
      marginTop: theme.spacing(1)
    },
    loading: {
      marginTop: theme.spacing(4),
      textAlign: 'center'
    }
  }),
  { name: 'GlobalTrigger' }
)

export default function Triggers() {
  useTitle('Trigger | Settings | Rechat')

  const classes = useStyles()
  const brandId = useSelector(selectActiveBrandId)
  const { isLoading, data: triggers, run } = useAsync<IGlobalTrigger[]>()
  const loadTriggers = useCallback(
    () => run(() => getTriggers(brandId)),
    [brandId, run]
  )

  useEffectOnce(() => {
    loadTriggers()
  })

  const renderTriggers = () => {
    if (isLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )
    }

    return <TriggerItems list={triggers} onSetupCallback={loadTriggers} />
  }

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
      {renderTriggers()}
    </>
  )
}
