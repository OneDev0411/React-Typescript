import React from 'react'

import { Avatar, Theme, makeStyles, createStyles } from '@material-ui/core'

import Deal from 'models/Deal'

interface Props {
  deal: IDeal
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7)
    }
  })
)

export function ListingImage({ deal }: Props) {
  const classes = useStyles()
  const imageUrl = Deal.get.field(deal, 'photo')
  const placeholderImageUrl = '/static/images/deals/group-146.svg'

  return (
    <Avatar
      src={imageUrl || placeholderImageUrl}
      variant="circle"
      className={classes.avatar}
    />
  )
}
