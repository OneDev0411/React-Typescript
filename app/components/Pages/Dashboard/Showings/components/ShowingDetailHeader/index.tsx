import { Box, Typography, makeStyles } from '@material-ui/core'

import LinkIcon from '@material-ui/icons/Link'

import { Link } from 'react-router'

import { Avatar } from 'components/Avatar'

const useStyles = makeStyles(
  theme => ({
    icon: {
      fontSize: 16,
      marginRight: theme.spacing(1)
    },
    grey: { color: theme.palette.grey[400] }
  }),
  { name: 'ShowingDetailHeader' }
)

interface ShowingDetailHeaderProps {
  address: string
  image: string
  link?: string
}

function ShowingDetailHeader({
  image,
  address,
  link
}: ShowingDetailHeaderProps) {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center">
      <Box flexShrink="0" flexGrow="0" mr={2}>
        <Avatar url={image} variant="circular" size="xlarge" />
      </Box>
      <Box>
        <Typography noWrap variant="subtitle1">
          {address}
        </Typography>
        {link && (
          <Box display="flex" alignItems="center" className={classes.grey}>
            <LinkIcon className={classes.icon} />
            <Link to={link} target="_blank">
              <Typography variant="body2" className={classes.grey}>
                {link}
              </Typography>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ShowingDetailHeader
