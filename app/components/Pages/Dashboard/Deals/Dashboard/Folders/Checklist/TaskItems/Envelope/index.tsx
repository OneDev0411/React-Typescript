import fecha from 'fecha'

import { Typography, Box } from '@material-ui/core'
import { Link } from 'react-router'

import { mdiFileOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import ActionsButton from '../../../../../components/ActionsButton'
import { EnvelopeStatus } from '../../EnvelopeStatus'

import { getEnvelopeActions } from '../helpers/get-envelope-actions'
import { useStyles } from '../styles'

interface Props {
  deal: IDeal
  task: IDealTask
  envelope: IDealEnvelope
}

export function Envelope({ deal, task, envelope }: Props) {
  const classes = useStyles()

  const actions: ActionButtonId[] = getEnvelopeActions(envelope)

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <div className={classes.horizontalLine} />
            <SvgIcon path={mdiFileOutline} />

            <div>
              <Box display="flex" alignItems="center" className={classes.title}>
                <Link
                  className={classes.link}
                  to={`/dashboard/deals/${deal.id}/view/${task.id}/envelope/${envelope.id}`}
                >
                  {envelope.title}
                  {' - '}
                  <EnvelopeStatus deal={deal} task={task} envelope={envelope} />
                </Link>
              </Box>
              <div>
                <Typography variant="caption" className={classes.date}>
                  {fecha.format(
                    new Date(envelope.created_at * 1000),
                    'MMM DD YYYY, h:mm A'
                  )}
                </Typography>
              </div>
            </div>
          </Box>

          <ActionsButton
            deal={deal}
            task={task}
            envelope={envelope}
            actions={actions}
          />
        </Box>
      </div>
    </div>
  )
}
