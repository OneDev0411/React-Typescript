import { Box, Avatar, Typography, makeStyles } from '@material-ui/core'
import { mdiHome } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius
    },
    lightText: { color: theme.palette.grey[500] }
  }),
  { name: 'ListingHipPocketCard' }
)

interface ListingHipPocketCardProps {
  title: string
  subtitle?: string
}

function ListingHipPocketCard({ title, subtitle }: ListingHipPocketCardProps) {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center" className={classes.root}>
      <Box mr={1}>
        <Avatar title="P">
          <SvgIcon path={mdiHome} />
        </Avatar>
      </Box>
      <Box>
        <Typography variant="subtitle1">{title}</Typography>
        {subtitle && (
          <Typography variant="subtitle2" className={classes.lightText}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ListingHipPocketCard
