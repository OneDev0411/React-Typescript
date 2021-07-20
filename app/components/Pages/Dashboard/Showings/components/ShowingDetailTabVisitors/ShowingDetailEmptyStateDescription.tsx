import { Link } from 'react-router'

interface ShowingDetailEmptyStateDescriptionProps {
  showingBookingUrl?: string
}

function ShowingDetailEmptyStateDescription({
  showingBookingUrl
}: ShowingDetailEmptyStateDescriptionProps) {
  return (
    <>
      Share your{' '}
      <Link to={showingBookingUrl || ''} target="_blank">
        Booking Page
      </Link>{' '}
      on your MLS listing, and with buyer agents and prospect to get some
      showings.
    </>
  )
}

export default ShowingDetailEmptyStateDescription
