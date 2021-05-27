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

export interface ShowingFilteredBookingListProps
  extends Pick<
      ShowingBookingListProps,
      'onApprovalAction' | 'onDismissAction' | 'hasPropertyColumn'
    >,
    WithRouterProps {
  appointments: IShowingAppointment[]
  generateLink: (filter: AppointmentFilter, location: Location) => string
}

function ShowingFilteredBookingList({
  appointments,
  onApprovalAction,
  onDismissAction,
  hasPropertyColumn,
  location,
  generateLink
}: ShowingFilteredBookingListProps) {
  const filter: AppointmentFilter = getValidAppointmentFilter(
    location.query.filter
  )

  const filterInfo = useAppointmentFilterInfo(filter)

  const filteredAppointments = useFilterAppointment(appointments, filterInfo)

  const { title, emptyMessage } = useAppointmentListInfo(filter)

  const generateLinkWithLocation = (filter: AppointmentFilter) =>
    generateLink(filter, location)

  return (
    <>
      <ShowingAppointmentFilters
        appointments={appointments}
        generateLink={generateLinkWithLocation}
        value={filter}
      />
      <ShowingBookingList
        title={title}
        rows={filteredAppointments}
        emptyMessage={emptyMessage}
        onApprovalAction={onApprovalAction}
        onDismissAction={onDismissAction}
        hasPropertyColumn={hasPropertyColumn}
        hasPastBookingsFilter
        key={`${filter}-bookings`}
      />
    </>
  )
}

export default withRouter(ShowingFilteredBookingList)
