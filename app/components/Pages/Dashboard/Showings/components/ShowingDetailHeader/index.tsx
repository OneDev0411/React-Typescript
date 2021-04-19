import { Box, Typography, makeStyles, Button } from '@material-ui/core'
import { Share as ShareIcon, Close as CloseIcon } from '@material-ui/icons'
import LinkIcon from '@material-ui/icons/Link'

import { Link } from 'react-router'

import { Avatar } from 'components/Avatar'

import LinkIconButton from '../LinkIconButton'

const useStyles = makeStyles(
  theme => ({
    icon: {
      fontSize: 16,
      marginRight: theme.spacing(1)
    },
    grey: { color: theme.palette.grey[400] },
    close: { marginLeft: theme.spacing(0.5) }
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
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" mr={1}>
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
                <Typography
                  variant="body2"
                  className={classes.grey}
                  component="span"
                >
                  {link}
                </Typography>
              </Link>
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        <Button size="small" variant="outlined" startIcon={<ShareIcon />}>
          Share
        </Button>
        <LinkIconButton className={classes.close} to="/dashboard/showings">
          <CloseIcon />
        </LinkIconButton>
      </Box>
    </Box>
  )
}

export default ShowingDetailHeader
