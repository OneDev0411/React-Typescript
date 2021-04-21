import { OpenInNewOutlined as OpenInNewOutlinedIcon } from '@material-ui/icons'

import LinkButton from '../LinkButton'

interface ShowingDetailHeaderBookingButtonProps {
  className?: string
  bookingUrl: string
}

function ShowingDetailHeaderBookingButton({
  className,
  bookingUrl
}: ShowingDetailHeaderBookingButtonProps) {
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
      Open Booking Page
    </LinkButton>
  )
}

export default ShowingDetailHeaderBookingButton
