import { Dispatch, SetStateAction } from 'react'

import { Location } from 'history'

import useSortAppointments from '../../hooks/use-sort-appointments'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'

import ShowingNotificationBookingLists from '../../components/ShowingNotificationBookingLists'
import useUpdateAppointmentStatus from './use-update-appointment-status'
import { AppointmentFilter, ApprovalActionParams } from '../../types'
import useAckAppointmentNotifications from './use-ack-appointment-notifications'

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

  const ackAppointmentNotifications = useAckAppointmentNotifications(setShowing)

  const handleApprovalAction = (params: ApprovalActionParams) => {
    updateAppointmentStatus(params)
    ackAppointmentNotifications(params)
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
