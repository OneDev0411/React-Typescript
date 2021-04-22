import { OpenInNewOutlined as OpenInNewOutlinedIcon } from '@material-ui/icons'

import useIsMobile from 'hooks/use-is-mobile'

import LinkButton from '../LinkButton'

interface ShowingDetailHeaderBookingButtonProps {
  className?: string
  bookingUrl: string
}

function ShowingDetailHeaderBookingButton({
  className,
  bookingUrl
}: ShowingDetailHeaderBookingButtonProps) {
  const isMobile = useIsMobile('xs')

  return (
    <LinkButton
      className={className}
      size="small"
      variant="contained"
      endIcon={<OpenInNewOutlinedIcon />}
      to={bookingUrl}
      target="_blank"
      color="primary"
    >
      {!isMobile && 'Open'} Booking Page
    </LinkButton>
  )
}

export default ShowingDetailHeaderBookingButton
