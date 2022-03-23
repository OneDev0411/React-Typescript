import { Box, Typography, makeStyles } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

import ShowingCloseButton from '../ShowingCloseButton'

import ShowingDetailHeaderAgentInfo from './ShowingDetailHeaderAgentInfo'
import ShowingDetailHeaderBookingButton from './ShowingDetailHeaderBookingButton'
import ShowingDetailHeaderCopyButton from './ShowingDetailHeaderCopyButton'
import ShowingDetailHeaderListing from './ShowingDetailHeaderListing'

const useStyles = makeStyles(
  theme => ({
    root: { backgroundColor: theme.palette.common.white },
    button: { marginRight: theme.spacing(2) },
    icon: {
      fontSize: 16,
      marginRight: theme.spacing(1)
    },

    header: {
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }
  }),
  { name: 'ShowingDetailHeader' }
)

interface ShowingDetailHeaderProps {
  address: string
  image: string
  listing?: IListing
  bookingUrl?: string
  roles?: IShowingRole[]
}

function ShowingDetailHeader({
  image,
  address,
  listing,
  bookingUrl,
  roles
}: ShowingDetailHeaderProps) {
  const classes = useStyles()

  return (
    <Box className={classes.root} px={4} pt={4}>
      <Box className={classes.header}>
        <Box display="flex" alignItems="center" mr={1} mb={2}>
          <Box flexShrink="0" flexGrow="0" mr={1}>
            <Avatar url={image} variant="circular" size="xlarge" />
          </Box>
          <Box>
            <Box ml={1}>
              <Typography noWrap variant="h6">
                {address}
              </Typography>
            </Box>
            <Box display="flex">
              {listing && <ShowingDetailHeaderListing listing={listing} />}
              {roles && <ShowingDetailHeaderAgentInfo roles={roles} />}
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          {bookingUrl ? (
            <div>
              <ShowingDetailHeaderCopyButton
                className={classes.button}
                bookingUrl={bookingUrl}
              />
              <ShowingDetailHeaderBookingButton bookingUrl={bookingUrl} />
            </div>
          ) : (
            <div />
          )}
          <ShowingCloseButton />
        </Box>
      </Box>
    </Box>
  )
}

export default ShowingDetailHeader
