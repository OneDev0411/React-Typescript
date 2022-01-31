import { ReactNode } from 'react'

import { Badge, Box, Typography, makeStyles, Grid } from '@material-ui/core'
import { mdiHomeOutline, mdiDatabaseOutline } from '@mdi/js'

import { Avatar } from 'components/Avatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { Notification } from 'deals/List/components/Notification'

export const useStyles = makeStyles(
  theme => ({
    badge: { position: 'static' },
    mlsSource: {
      ...theme.typography.caption,
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700]
    },
    mlsSourceIcon: {
      maxWidth: 14, // From figma
      maxHeight: 14, // From figma
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'TableColumnProperty' }
)

export interface TableColumnPropertyProps {
  image: string
  address: string
  badge?: number
  children?: ReactNode
  mlsSource: Nullable<string>
  onClick?: () => void
}

function TableColumnProperty({
  image,
  address,
  badge,
  children,
  mlsSource,
  onClick
}: TableColumnPropertyProps) {
  const classes = useStyles()
  const avatar = (
    <Avatar url={image} variant="circular">
      <SvgIcon path={mdiHomeOutline} />
    </Avatar>
  )

  return (
    <Box display="flex" alignItems="center" mr={1} onClick={onClick}>
      <Box flexShrink="0" flexGrow="0" mr={2}>
        {badge ? (
          <Badge
            badgeContent={
              <Notification className={classes.badge} count={badge} />
            }
          >
            {avatar}
          </Badge>
        ) : (
          avatar
        )}
      </Box>
      <Grid container direction="column">
        <Grid>
          <Typography className="underline-on-hover" noWrap variant="body2">
            {address}
          </Typography>
        </Grid>
        {mlsSource && (
          <Grid
            className={classes.mlsSource}
            item
            title="Listing Provider (MLS) Source"
          >
            <SvgIcon
              path={mdiDatabaseOutline}
              className={classes.mlsSourceIcon}
            />
            {mlsSource}
          </Grid>
        )}
      </Grid>
      {children}
    </Box>
  )
}

export default TableColumnProperty
