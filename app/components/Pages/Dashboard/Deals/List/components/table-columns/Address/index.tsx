import { makeStyles, Typography } from '@material-ui/core'
import { mdiHomeOutline } from '@mdi/js'
import { Link } from 'react-router'

import { Avatar } from 'components/Avatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { getField, getEnderType } from 'models/Deal/helpers/context'

import { Notification } from '../../Notification'
import { Side } from '../Side'

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      marginLeft: theme.spacing(1)
    },
    photoContainer: {
      marginRight: theme.spacing(1),
      position: 'relative'
    },
    side: {
      color: theme.palette.grey[600]
    },
    enderType: {
      color: theme.palette.grey[600]
    }
  }),
  {
    name: 'AgentGrid'
  }
)

interface Props {
  deal: IDeal
  roles?: Record<UUID, IDealRole>
  rowIndex?: number
  totalRows?: number
  notificationsCount: number
  originQueryParam?: string
}

export function Address({
  deal,
  roles,
  rowIndex,
  totalRows,
  notificationsCount,
  originQueryParam = ''
}: Props) {
  const classes = useStyles()
  const photo = getField(deal, 'photo')

  return (
    <Link
      to={`/dashboard/deals/${deal.id}${
        originQueryParam ? `?${originQueryParam}` : ''
      }`}
      className={classes.container}
    >
      <div className={classes.photoContainer}>
        {notificationsCount > 0 && <Notification count={notificationsCount} />}
        <Avatar url={photo}>
          <SvgIcon path={mdiHomeOutline} />
        </Avatar>
      </div>

      <div className={classes.title}>
        <div className="underline-on-hover">
          <TextMiddleTruncate text={deal.title} maxLength={40} />
        </div>

        <div className={classes.container}>
          <Typography variant="caption" className={classes.enderType}>
            {getEnderType(deal)}
          </Typography>

          {roles && (
            <div className={classes.side}>
              <Side
                deal={deal}
                roles={roles}
                rowId={rowIndex! + 1}
                rowsCount={totalRows!}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
