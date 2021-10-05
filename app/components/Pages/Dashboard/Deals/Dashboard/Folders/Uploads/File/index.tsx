import { Grid, Typography, Tooltip } from '@material-ui/core'
import { mdiFileOutline } from '@mdi/js'
import moment from 'moment'
import { Link } from 'react-router'
import Flex from 'styled-flex-component'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import {
  MOVE_FILE,
  VIEW_FILE,
  DELETE_FILE,
  SPLIT_PDF
} from 'deals/components/ActionsButton/data/action-buttons'

import ActionsButton from '../../../../components/ActionsButton'
import { useStyles } from '../../Checklist/TaskRow/styles'

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    deal: IDeal
    files: IFile[]
  }
}

export function File({ index, style, data: { files, deal } }: Props) {
  const classes = useStyles({ index })
  const file = files[index]

  return (
    <Grid container className={classes.row} style={style}>
      <Flex alignCenter>
        <div className={classes.iconContainer}>
          <SvgIcon path={mdiFileOutline} />
        </div>

        <div>
          <Flex alignCenter>
            <Link
              className={classes.link}
              to={`/dashboard/deals/${deal.id}/view/stash/attachment/${file.id}`}
            >
              <span className={classes.title}>
                <TextMiddleTruncate text={file.name} maxLength={80} />
              </span>
            </Link>
          </Flex>

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
      </Flex>

      <Flex alignCenter className={classes.actions}>
        <div className="visible-on-hover">
          <Flex alignCenter>
            <ActionsButton
              type="file"
              deal={deal}
              task={null}
              file={file}
              actions={getActions(file)}
            />
          </Flex>
        </div>
      </Flex>
    </Grid>
  )
}

const getActions = (file: IFile) => {
  const actions = [MOVE_FILE, VIEW_FILE, DELETE_FILE]

  return file.mime === 'application/pdf' ? [SPLIT_PDF, ...actions] : actions
}
