import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'

import { mdiHomeOutline } from '@mdi/js'

import Avatar from 'components/Avatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import ALinkToClosable from 'components/ALinkToClosable'
import { getField } from 'models/Deal/helpers/context'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { Side } from '../Side'

import onDealOpened from '../../../../utils/on-deal-opened'
import { Notification } from '../../Notification'

const useStyles = makeStyles(
  (theme: Theme) => ({
    homeIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.spacing(4),
      height: theme.spacing(4),
      borderRadius: '100%',
      backgroundColor: theme.palette.grey[200]
    },
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    photoContainer: {
      marginRight: theme.spacing(1),
      position: 'relative'
    },
    circle: {
      width: theme.spacing(0.5),
      height: theme.spacing(0.5),
      margin: theme.spacing(0, 1),
      borderRadius: '100%',
      backgroundColor: theme.palette.grey[500]
    },
    side: {
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
}

export function Address({
  deal,
  roles,
  rowIndex,
  totalRows,
  notificationsCount
}: Props) {
  const classes = useStyles()
  const photo = getField(deal, 'photo')

  return (
    <div className={classes.container}>
      <div className={classes.photoContainer}>
        {notificationsCount > 0 && <Notification count={notificationsCount} />}

        {photo ? (
          <Avatar image={photo} size={32} />
        ) : (
          <div className={classes.homeIcon}>
            <SvgIcon path={mdiHomeOutline} />
          </div>
        )}
      </div>

      <ALinkToClosable
        className="underline-on-hover"
        onClick={onDealOpened}
        to={`/dashboard/deals/${deal.id}`}
      >
        <TextMiddleTruncate text={deal.title} maxLength={40} />
      </ALinkToClosable>

      {roles && (
        <>
          <div className={classes.circle} />
          <div className={classes.side}>
            <Side
              deal={deal}
              roles={roles}
              rowId={rowIndex! + 1}
              rowsCount={totalRows!}
            />
          </div>
        </>
      )}
    </div>
  )
}
