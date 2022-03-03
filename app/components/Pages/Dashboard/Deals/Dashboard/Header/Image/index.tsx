import { Theme, makeStyles, createStyles } from '@material-ui/core'

import { getField } from '@app/models/Deal/helpers/context'
import { Avatar } from 'components/Avatar'

interface Props {
  deal: IDeal
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
    getField(deal, 'photo') ?? '/static/images/deals/group-146.svg'

  return <Avatar url={imageUrl} variant="circle" className={classes.avatar} />
}
