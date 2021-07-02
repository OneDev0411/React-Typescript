import { ReactNode } from 'react'
import { Badge, Box, Typography, makeStyles } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

// TODO: move this to the global scope
import { Notification } from 'deals/List/components/Notification'

const useStyles = makeStyles(
  {
    badge: { position: 'static' }
  },
  { name: 'TableColumnProperty' }
)

export interface TableColumnPropertyProps {
  image: string
  address: string
  badge?: number
  children?: ReactNode
  onClick?: () => void
}

function TableColumnProperty({
  image,
  address,
  badge,
  children,
  onClick
}: TableColumnPropertyProps) {
  const classes = useStyles()
  const avatar = <Avatar url={image} variant="circular" />

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
      <Typography noWrap variant="body2">
        {address}
      </Typography>
      {children}
    </Box>
  )
}

export default TableColumnProperty
