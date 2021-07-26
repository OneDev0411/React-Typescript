import { mdiOpenInNew } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
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
      endIcon={<SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />}
      to={bookingUrl}
      target="_blank"
      color="primary"
    >
      {!isMobile && 'Open'} Booking Page
    </LinkButton>
  )
}

export default ShowingDetailHeaderBookingButton
