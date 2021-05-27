import { Dispatch, SetStateAction } from 'react'

import { Location } from 'history'

import ShowingFilteredBookingList from '../../components/ShowingFilteredBookingList'
import { AppointmentFilter } from '../../types'
import useShowingUpdateAppointmentStatus from './use-showing-update-appointment-status'
import useShowingDismissAppointmentNotifications from './use-showing-dismiss-appointment-notifications'

const generateAppointmentFilterLink = (
  filter: AppointmentFilter,
  location: Location
) => `${location.pathname}?filter=${filter}`

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
  setShowing: Dispatch<SetStateAction<IShowing>>
}

function ShowingDetailTabBookings({
  appointments,
  setShowing
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
    />
  )
}

export default ShowingDetailTabBookings
