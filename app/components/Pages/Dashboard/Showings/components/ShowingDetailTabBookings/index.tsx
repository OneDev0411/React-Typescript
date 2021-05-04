import { Dispatch, SetStateAction } from 'react'

import { Location } from 'history'

import useSortAppointments from '../../hooks/use-sort-appointments'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'

import useUpdateAppointmentStatus from './use-update-appointment-status'
import ShowingNotificationBookingLists from '../ShowingNotificationBookingLists'
import { AppointmentFilter, ApprovalActionParams } from '../../types'
import useMarkAppointmentNotificationsAsSeen from './use-mark-appointment-notifications-as-seen'

const generateAppointmentFilterLink = (
  filter: AppointmentFilter,
  location: Location
) => `${location.pathname}?filter=${filter}`

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
  setShowing: Dispatch<SetStateAction<IShowing>>
}

function ShowingDetailTabBookings({
  appointments: allAppointments,
  setShowing
}: ShowingDetailTabBookingsProps) {
  const sortedAppointments = useSortAppointments(allAppointments)

  const { appointments, notifications } = useAppointmentNotificationLists(
    sortedAppointments
  )

  const updateAppointmentStatus = useUpdateAppointmentStatus(setShowing)

  const markAppointmentNotificationsAsSeen = useMarkAppointmentNotificationsAsSeen(
    setShowing
  )

  const handleApprovalAction = (params: ApprovalActionParams) => {
    updateAppointmentStatus(params)
    markAppointmentNotificationsAsSeen(params)
  }

  return (
    <ShowingNotificationBookingLists
      appointments={appointments}
      notifications={notifications}
      onApprovalAction={handleApprovalAction}
      generateLink={generateAppointmentFilterLink}
    />
  )
}

export default ShowingDetailTabBookings
