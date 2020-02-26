import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { useIconStyles } from 'views/../styles/use-icon-styles'
import IconHome from 'components/SvgIcons/NewHome/IconHome'
import Avatar from 'components/Avatar'

import ALinkToClosable from 'components/ALinkToClosable'

import { getField } from 'models/Deal/helpers/context'

import { Side } from '../Side'

import onDealOpened from '../../../../utils/on-deal-opened'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    homeIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.spacing(4),
      height: theme.spacing(4),
      borderRadius: '100%',
      backgroundColor: theme.palette.common.black
    },
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    photoContainer: {
      marginRight: theme.spacing(1)
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
  })
)

interface Props {
  deal: IDeal
  roles?: Record<UUID, IDealRole>
  rowIndex?: number
  totalRows?: number
}

export function Address({ deal, roles, rowIndex, totalRows }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const photo = getField(deal, 'photo')

  return (
    <div className={classes.container}>
      <div className={classes.photoContainer}>
        {photo ? (
          <Avatar image={photo} size={32} />
        ) : (
          <div className={classes.homeIcon}>
            <IconHome className={iconClasses.small} />
          </div>
        )}
      </div>

      <ALinkToClosable
        onClick={onDealOpened}
        to={`/dashboard/deals/${deal.id}`}
      >
        {deal.title}
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
