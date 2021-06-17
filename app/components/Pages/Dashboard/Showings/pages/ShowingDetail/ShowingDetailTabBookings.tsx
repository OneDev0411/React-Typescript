import { Dispatch, SetStateAction } from 'react'

import { Location } from 'history'

import ShowingFilteredBookingList from '../../components/ShowingFilteredBookingList'
import { AppointmentFilter } from '../../types'
import useShowingUpdateAppointmentStatus from './use-showing-update-appointment-status'
import useShowingDismissAppointmentNotifications from './use-showing-dismiss-appointment-notifications'
import ShowingDetailEmptyStateDescription from '../../components/ShowingDetailTabVisitors/ShowingDetailEmptyStateDescription'

const generateAppointmentFilterLink = (
  filter: AppointmentFilter,
  location: Location
) => `${location.pathname}?filter=${filter}`

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
  setShowing: Dispatch<SetStateAction<IShowing>>
  showingBookingUrl?: string
}

function ShowingDetailTabBookings({
  appointments,
  setShowing,
  showingBookingUrl
}: ShowingDetailTabBookingsProps) {
  const updateShowingAppointmentStatus = useShowingUpdateAppointmentStatus(
    setShowing
  )

  const dismissShowingAppointmentNotifications = useShowingDismissAppointmentNotifications(
    setShowing
  )

  return (
    <ShowingFilteredBookingList
      appointments={appointments}
      onApprovalAction={updateShowingAppointmentStatus}
      generateLink={generateAppointmentFilterLink}
      onDismissAction={dismissShowingAppointmentNotifications}
      emptyButtonLabel="Open Booking Page"
      emptyButtonLink={showingBookingUrl}
      emptyButtonTarget="_blank"
      emptyDescription={
        <ShowingDetailEmptyStateDescription
          showingBookingUrl={showingBookingUrl}
        />
      }
    />
  )
}

export default ShowingDetailTabBookings
