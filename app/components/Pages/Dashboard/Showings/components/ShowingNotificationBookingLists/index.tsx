import { withRouter, WithRouterProps } from 'react-router'

import { Location } from 'history'

import ShowingBookingList, {
  ShowingBookingListProps
} from '../ShowingBookingList'
import useAppointmentListInfo from '../../hooks/use-appointment-list-info'
import useAppointmentFilterInfo from '../../hooks/use-appointment-filter-info'
import useFilterAppointment from '../../hooks/use-filter-appointment'
import { AppointmentFilter } from '../../types'
import ShowingAppointmentFilters from '../ShowingAppointmentFilters'
import { getValidAppointmentFilter } from './helpers'

export interface ShowingNotificationBookingListsProps
  extends Pick<
      ShowingBookingListProps,
      'onApprovalAction' | 'hasPropertyColumn'
    >,
    WithRouterProps {
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
  generateLink: (filter: AppointmentFilter, location: Location) => string
}

function ShowingNotificationBookingLists({
  appointments,
  notifications,
  onApprovalAction,
  hasPropertyColumn,
  location,
  generateLink
}: ShowingNotificationBookingListsProps) {
  const filter: AppointmentFilter = getValidAppointmentFilter(
    location.query.filter
  )

  const filterInfo = useAppointmentFilterInfo(filter)

  const filteredAppointments = useFilterAppointment(appointments, filterInfo)
  const filteredNotifications = useFilterAppointment(notifications, filterInfo)

  const {
    hasNotifications,
    notificationsTitle,
    notificationsEmptyMessage,
    hasBookings,
    bookingsTitle,
    bookingsEmptyMessage
  } = useAppointmentListInfo(filter)

  const generateLinkWithLocation = (filter: AppointmentFilter) =>
    generateLink(filter, location)

  const isBothListEmpty =
    hasNotifications &&
    !filteredNotifications.length &&
    hasBookings &&
    !filteredAppointments.length

  return (
    <>
      <ShowingAppointmentFilters
        appointments={appointments}
        notifications={notifications}
        generateLink={generateLinkWithLocation}
        value={filter}
      />
      {hasNotifications && (
        <ShowingBookingList
          title={notificationsTitle}
          rows={filteredNotifications}
          notificationMode
          emptyMessage={notificationsEmptyMessage}
          hideEmptyMessage={isBothListEmpty || !!filteredAppointments.length}
          onApprovalAction={onApprovalAction}
          hasPropertyColumn={hasPropertyColumn}
        />
      )}
      {hasBookings && (
        <ShowingBookingList
          title={bookingsTitle}
          rows={filteredAppointments}
          emptyMessage={bookingsEmptyMessage}
          onApprovalAction={onApprovalAction}
          hasPropertyColumn={hasPropertyColumn}
        />
      )}
    </>
  )
}

export default withRouter(ShowingNotificationBookingLists)
