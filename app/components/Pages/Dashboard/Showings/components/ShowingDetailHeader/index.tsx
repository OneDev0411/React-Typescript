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
    },
    agentName: { margin: theme.spacing(0, 1) }
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

  const sellerAgent = roles?.find(user => user.role === 'SellerAgent')

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
              {listing && (
                <LinkButton
                  color="secondary"
                  size="medium"
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
              {roles && (
                <Box display="flex" alignItems="center" ml={4}>
                  <Typography noWrap variant="caption" color="textSecondary">
                    Agent
                  </Typography>
                  <Typography
                    noWrap
                    variant="subtitle2"
                    className={classes.agentName}
                  >
                    {`${sellerAgent?.first_name} ${sellerAgent?.last_name}`}
                  </Typography>
                  {sellerAgent?.office_name && (
                    <Typography
                      noWrap
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {sellerAgent?.office_name}
                    </Typography>
                  )}
                </Box>
              )}
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
