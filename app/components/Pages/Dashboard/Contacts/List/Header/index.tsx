import { Grid } from '@material-ui/core'

import ContactsSegments from '../ContactsSegments'
import ContactFilters from '../Filters'
import { SortFields } from '../SortFields'
import { SyncedContacts as SyncedContactsTypes } from '../utils/get-synced-contacts'
import { ViewSwitcher } from '../ViewSwitcher'

export type ViewModeType = 'table' | 'board'

export interface Props {
  handleFilterChange: (newFilters: object, resetLoadedRanges: boolean) => void
  handleResetShortcutFilter: () => void
  filter: {
    show: boolean
  }
  tagListProps: {
    onClick: (props: unknown) => void
    isActive: boolean
  }
  savedListProps: {
    name: string
    associations: string
    getPredefinedLists: () => void
    onChange: (segment: unknown) => void
  }
  sortProps: {
    onChange: (item: unknown) => void
    currentOrder: string
    searchValue: string
  }
  onChangeView: (viewMode: ViewModeType) => void
  viewMode: ViewModeType
  contactCount: number
  activeSegment: any
  users: UUID[]
  syncedContacts: SyncedContactsTypes
}

export const Header = ({
  handleResetShortcutFilter,
  handleFilterChange,
  savedListProps,
  onChangeView,
  activeSegment,
  contactCount,
  tagListProps,
  sortProps,
  viewMode,
  filter,
  users
}: Props) => {
  return (
    <Grid direction="column" container>
      <Grid>
        <ContactsSegments
          activeSegment={activeSegment}
          handleResetShortcutFilter={handleResetShortcutFilter}
          handleFilterChange={handleFilterChange}
          savedListProps={savedListProps}
          tagListProps={tagListProps}
        />
      </Grid>
      <Grid container justifyContent="space-between" alignItems="center">
        <ContactFilters
          show={filter?.show}
          contactCount={contactCount}
          activeSegment={activeSegment}
          onFilterChange={() => handleFilterChange({}, true)}
          viewMode={viewMode}
          users={users}
        />
        <Grid>
          <SortFields {...sortProps} />
          <ViewSwitcher onChangeView={onChangeView} activeView={viewMode} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Header
