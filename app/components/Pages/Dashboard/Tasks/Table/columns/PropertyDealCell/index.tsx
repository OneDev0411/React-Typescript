import { useMemo } from 'react'

import {
  Box,
  Chip,
  makeStyles,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import { mdiHome } from '@mdi/js'
import cn from 'classnames'

import { getField } from '@app/models/Deal/helpers/context'
import { Avatar } from '@app/views/components/Avatar'
import { SvgIcon } from '@app/views/components/SvgIcons'

import type { ITask } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    chip: {
      color: '#000'
    },
    done: {
      color: theme.palette.grey[400]
    }
  }),
  {
    name: 'Tasks-ContactsCell'
  }
)

interface Props {
  task: ITask
}

export function PropertyDealCell({ task }: Props) {
  const classes = useStyles()
  const isTaskDone = task.status === 'DONE'

  const associations = useMemo(
    () =>
      task.associations?.filter(association =>
        ['listing', 'deal'].includes(association.association_type)
      ),
    [task.associations]
  )

  const [listings, deals] = useMemo(() => {
    const listings: ICRMTaskAssociation<'listing'>[] | undefined =
      associations?.filter(
        association => association.association_type === 'listing'
      )
    const deals: ICRMTaskAssociation<'deal'>[] | undefined =
      associations?.filter(
        association => association.association_type === 'deal'
      )

    return [listings, deals]
  }, [associations])

  const itemsCount = (deals?.length ?? 0) + (listings?.length ?? 0)
  const badgeCounter = itemsCount - 1

  const getImageUrl = () => {
    if (deals?.length) {
      return getField(deals[0].deal!, 'photo') || ''
    }

    if (listings?.length) {
      return listings[0].listing?.cover_image_url || ''
    }

    return ''
  }

  const getCaption = () => {
    if (deals?.length) {
      return deals[0].deal?.title ?? ''
    }

    if (listings?.length) {
      return listings[0].listing?.property?.address.full_address ?? ''
    }

    return ''
  }

  if (itemsCount === 0) {
    return null
  }

  return (
    <div className={cn(classes.root, { [classes.done]: isTaskDone })}>
      <Box
        className="overflow-ellipsis"
        display="flex"
        alignItems="center"
        mr={1}
      >
        <Box mr={1}>
          <Avatar size="small" url={getImageUrl()}>
            <SvgIcon path={mdiHome} />
          </Avatar>
        </Box>
        <Tooltip title={getCaption()}>
          <Typography variant="caption">{getCaption()}</Typography>
        </Tooltip>
      </Box>

      {badgeCounter > 0 && (
        <Chip
          className={cn(classes.chip, { [classes.done]: isTaskDone })}
          size="small"
          variant="outlined"
          label={`${badgeCounter} more`}
        />
      )}
    </div>
  )
}
