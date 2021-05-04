import { ReactNode } from 'react'
import { Box, Typography, makeStyles, Button } from '@material-ui/core'
import {
  Close as CloseIcon,
  OpenInNewOutlined as OpenInNewOutlinedIcon
} from '@material-ui/icons'

import { Avatar } from 'components/Avatar'

import LinkIconButton from '../LinkIconButton'
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
    close: { marginLeft: theme.spacing(0.5) },
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
  mlsNumber?: string
  children: ReactNode
  bookingUrl?: string
}

function ShowingDetailHeader({
  image,
  address,
  mlsNumber,
  children,
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
            {mlsNumber && (
              <Button
                color="secondary"
                size="small"
                variant="text"
                endIcon={<OpenInNewOutlinedIcon />}
              >
                MLS# {mlsNumber}
              </Button>
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
          <LinkIconButton className={classes.close} to="/dashboard/showings">
            <CloseIcon />
          </LinkIconButton>
        </Box>
      </Box>
      {children}
    </Box>
  )
}

export default ShowingDetailHeader
