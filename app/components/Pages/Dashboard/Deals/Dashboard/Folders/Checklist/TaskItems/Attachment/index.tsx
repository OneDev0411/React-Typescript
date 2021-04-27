import fecha from 'fecha'
import { Box } from '@material-ui/core'

import { mdiFileDocumentOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import ActionsButton from '../../../../../components/ActionsButton'

import { ItemLink } from './ItemLink'

import { useStyles } from '../styles'

import { getFileActions } from '../helpers/get-file-actions'

interface Props {
  deal: IDeal
  task: IDealTask
  file: IFile
  isBackOffice: boolean
}

export function Attachment({ deal, task, file, isBackOffice }: Props) {
  const actions: ActionButtonId[] = getFileActions(file)
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <div className={classes.horizontalLine} />
            <SvgIcon path={mdiFileDocumentOutline} />

            <div className={classes.title}>
              <ItemLink
                file={file}
                deal={deal}
                taskId={task.id}
                isBackOffice={isBackOffice}
              >
                <TextMiddleTruncate text={file.name} maxLength={75} />
              </ItemLink>
            </div>

            <div className={classes.subtitle}>Uploaded File</div>
          </Box>

          <Box display="flex">
            <div className={classes.date}>
              Uploaded at{' '}
              {fecha.format(
                new Date(file.created_at * 1000),
                'MMM DD YYYY, h:mm A'
              )}
            </div>
          </Box>

          <ActionsButton
            deal={deal}
            task={task}
            file={file}
            actions={actions}
          />
        </Box>
      </div>
    </div>
  )
}
