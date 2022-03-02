import { Theme, makeStyles, createStyles } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

interface Props {
  deal: IDeal // TODO: all related IDeal should change to IDeal<'listing_info'>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(6),
      height: theme.spacing(6)
    }
  })
)

export function ListingImage({ deal }: Props) {
  const classes = useStyles()
  const imageUrl =
    (deal as unknown as IDeal<'listing_info'>).listing_info?.cover_image_url ??
    '/static/images/deals/group-146.svg'

  return <Avatar url={imageUrl} variant="circle" className={classes.avatar} />
}
