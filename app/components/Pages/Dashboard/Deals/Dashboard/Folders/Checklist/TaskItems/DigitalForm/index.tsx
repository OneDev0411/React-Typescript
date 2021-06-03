import { Box } from '@material-ui/core'
import { Link } from 'react-router'

import { mdiFilePdfOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import ActionsButton from '../../../../../components/ActionsButton'
import { getFormActions } from '../helpers/get-form-actions'

import { useStyles } from '../styles'

interface Props {
  deal: IDeal
  task: IDealTask
}

export function DigitalForm({ deal, task }: Props) {
  const classes = useStyles()

  if (!task || !task.form) {
    return null
  }

  const actions: ActionButtonId[] = getFormActions()

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <div className={classes.horizontalLine} />
            <SvgIcon path={mdiFilePdfOutline} />

            <div className={classes.title}>
              <Link
                className={classes.link}
                to={`/dashboard/deals/${deal.id}/form-edit/${task.id}`}
              >
                Digital Form
              </Link>
            </div>
          </Box>

          <ActionsButton deal={deal} task={task} actions={actions} />
        </Box>
      </div>
    </div>
  )
}
