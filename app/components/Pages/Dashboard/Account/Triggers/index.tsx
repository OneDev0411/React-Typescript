import {
  CircularProgress,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useTitle } from 'react-use'

import { selectActiveBrandId } from '@app/selectors/brand'

import { TriggerItems } from './components/Items'
import { useGetGlobalTriggers } from './hooks/use-get-global-triggers'

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
  const { isLoading, globalTriggers, reload } = useGetGlobalTriggers(brandId)
  const renderTriggers = () => {
    if (isLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )
    }

    return <TriggerItems list={globalTriggers} onSetupCallback={reload} />
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
