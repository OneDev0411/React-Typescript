import { Box, Typography, makeStyles } from '@material-ui/core'
import { mdiOpenInNew } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Avatar } from 'components/Avatar'

import LinkButton from '../LinkButton'
import ShowingCloseButton from '../ShowingCloseButton'

import ShowingDetailHeaderBookingButton from './ShowingDetailHeaderBookingButton'
import ShowingDetailHeaderCopyButton from './ShowingDetailHeaderCopyButton'

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
}

function ShowingDetailHeader({
  image,
  address,
  listing,
  bookingUrl
}: ShowingDetailHeaderProps) {
  const classes = useStyles()

  return (
    <Box className={classes.root} px={4} pt={4}>
      <Box className={classes.header}>
        <Box display="flex" alignItems="center" mr={1} mb={2}>
          <Box flexShrink="0" flexGrow="0" mr={2}>
            <Avatar url={image} variant="circular" size="xlarge" />
          </Box>
          <Box>
            <Typography noWrap variant="subtitle1">
              {address}
            </Typography>
            {listing && (
              <LinkButton
                color="secondary"
                size="small"
                variant="text"
                endIcon={
                  <SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />
                }
                to={`/dashboard/mls/${listing.id}`}
                target="_blank"
              >
                MLS# {listing.mls_number}
              </LinkButton>
            )}
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
