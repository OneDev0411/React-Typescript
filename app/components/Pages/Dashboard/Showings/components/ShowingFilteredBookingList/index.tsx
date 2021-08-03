import { Location } from 'history'
import { withRouter, WithRouterProps } from 'react-router'

import useAppointmentFilterInfo from '../../hooks/use-appointment-filter-info'
import useAppointmentListInfo from '../../hooks/use-appointment-list-info'
import useFilterAppointment from '../../hooks/use-filter-appointment'
import { AppointmentFilter } from '../../types'
import ShowingAppointmentFilters from '../ShowingAppointmentFilters'
import ShowingBookingList, {
  ShowingBookingListProps
} from '../ShowingBookingList'

import { getValidAppointmentFilter } from './helpers'

export interface ShowingFilteredBookingListProps
  extends Pick<
      ShowingBookingListProps,
      | 'onApprovalAction'
      | 'onAckAction'
      | 'hasPropertyColumn'
      | 'stackDateAndTimeColumns'
      | 'emptyButtonLabel'
      | 'emptyButtonLink'
      | 'emptyButtonTarget'
      | 'emptyDescription'
    >,
    WithRouterProps {
  appointments: IShowingAppointment<'showing'>[]
  generateLink: (filter: AppointmentFilter, location: Location) => string
}

function ShowingFilteredBookingList({
  appointments,
  onApprovalAction,
  onAckAction,
  hasPropertyColumn,
  location,
  generateLink,
  stackDateAndTimeColumns,
  emptyButtonLabel,
  emptyButtonLink,
  emptyButtonTarget,
  emptyDescription
}: ShowingFilteredBookingListProps) {
  const hasData = !!appointments.length

  const filter: AppointmentFilter = getValidAppointmentFilter(
    location.query.filter
  )

  const filterInfo = useAppointmentFilterInfo(filter)

  const filteredAppointments = useFilterAppointment(appointments, filterInfo)

  const { emptyMessage } = useAppointmentListInfo(filter)

  const generateLinkWithLocation = (filter: AppointmentFilter) =>
    generateLink(filter, location)

  return (
    <>
      {hasData && (
        <ShowingAppointmentFilters
          appointments={appointments}
          generateLink={generateLinkWithLocation}
          value={filter}
        />
      )}
      <ShowingBookingList
        rows={filteredAppointments}
        emptyMessage={emptyMessage}
        onApprovalAction={onApprovalAction}
        onAckAction={onAckAction}
        hasPropertyColumn={hasPropertyColumn}
        hasPastBookingsFilter
        stackDateAndTimeColumns={stackDateAndTimeColumns}
        hasTextEmptyState={hasData}
        emptyButtonLabel={emptyButtonLabel}
        emptyButtonLink={emptyButtonLink}
        emptyButtonTarget={emptyButtonTarget}
        emptyDescription={emptyDescription}
        key={`${filter}-bookings`}
      />
    </>
  )
}

export default withRouter(ShowingFilteredBookingList)
