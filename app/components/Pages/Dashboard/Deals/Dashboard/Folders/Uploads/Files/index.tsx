import { Grid, Box, Typography, Tooltip } from '@material-ui/core'
import { Link } from 'react-router'
import { mdiFileOutline } from '@mdi/js'

import moment from 'moment'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import {
  MOVE_FILE,
  VIEW_FILE,
  DELETE_FILE,
  SPLIT_PDF
} from 'deals/components/ActionsButton/data/action-buttons'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import ActionsButton from '../../../../components/ActionsButton'
import { useStyles } from '../../Checklist/TaskRow/styles'

interface Props {
  index: number
  deal: IDeal
  file: IFile
}

export function Files({ index, deal, file }: Props) {
  const classes = useStyles({ index })

  const getActions = (file: IFile) => {
    const actions = [MOVE_FILE, VIEW_FILE, DELETE_FILE]

    return file.mime === 'application/pdf' ? [SPLIT_PDF, ...actions] : actions
  }

  return (
    <Grid container className={classes.row}>
      <Box display="flex" alignItems="center">
        <Box mx={1.5}>
          <SvgIcon path={mdiFileOutline} />
        </Box>

        <div>
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Link
                className={classes.link}
                to={`/dashboard/deals/${deal.id}/view/stash/attachment/${file.id}`}
              >
                <span className={classes.title}>
                  {' '}
                  <TextMiddleTruncate text={file.name} maxLength={80} />
                </span>
              </Link>
            </Box>
          </Box>

          <Typography variant="caption" className={classes.caption}>
            <Tooltip
              placement="bottom"
              title={moment
                .unix(file.created_at)
                .format('MMM DD, YYYY, hh:mm A')}
            >
              <span>Uploaded {moment.unix(file.created_at).fromNow()}</span>
            </Tooltip>
          </Typography>
        </div>
      </Box>

      <Box display="flex" alignItems="center" className={classes.actions}>
        <div className="visible-on-hover">
          <Box display="flex" alignItems="center">
            <ActionsButton
              deal={deal}
              task={null}
              file={file}
              actions={getActions(file)}
            />
          </Box>
        </div>
      </Box>
    </Grid>
  )
}
