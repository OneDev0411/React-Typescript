import { makeStyles } from '@material-ui/core'
import {
  mdiCake,
  mdiCalendarOutline,
  mdiEmailOutline,
  mdiLightningBoltOutline,
  mdiPhoneOutline,
  mdiTagMultipleOutline
} from '@mdi/js'
import cn from 'classnames'

import { useBreakpoint } from '@app/hooks/use-breakpoint'
import { Table } from '@app/views/components/Grid/Table'
import { resetRows } from '@app/views/components/Grid/Table/context/actions/selection/reset-rows'
import { BirthdayCell } from '@app/views/components/Grid/Table/features/cells/BirthdayCell'
import { EmailCell } from '@app/views/components/Grid/Table/features/cells/EmailCell'
import FlowsCell from '@app/views/components/Grid/Table/features/cells/FlowsCell'
import ColumnHeaderCell from '@app/views/components/Grid/Table/features/cells/header/ColumnHeaderCell'
import { LastTouchCell } from '@app/views/components/Grid/Table/features/cells/LastTouchCell'
import { PhoneNumberCell } from '@app/views/components/Grid/Table/features/cells/PhoneNumberCell'
import TagsCell from '@app/views/components/Grid/Table/features/cells/TagsCell'
import { EditTextCell } from '@app/views/components/Grid/Table/features/cells/types/EditTextCell'
import { useGridContext } from '@app/views/components/Grid/Table/hooks/use-grid-context'
import {
  useGridStyles,
  useInlineGridStyles
} from '@app/views/components/Grid/Table/styles'
import { getAttributeFromSummary } from 'models/contacts/helpers'

import NoSearchResults from '../../../../../Partials/no-search-results'
import { PARKED_CONTACTS_LIST_ID } from '../constants'

import { TableActions } from './Actions'
import Avatar from './columns/Avatar'
import { LoadingComponent } from './components/LoadingComponent'

const useCustomGridStyles = makeStyles(theme => ({
  row: {
    '& .column': {
      '&.tags': {
        '& .MuiChip-root': { opacity: 0.5 }
      },
      '&.flows': {
        '& a': { color: theme.palette.grey['500'] },
        '& svg': { fill: theme.palette.grey['500'] }
      }
    },
    '&:hover .column': {
      '&.tags': {
        '& .MuiChip-root': { opacity: 1 }
      },
      '&.flows': {
        '& a': { color: theme.palette.text.primary },
        '& svg': { fill: theme.palette.text.primary }
      }
    }
  }
}))

const ContactsList = props => {
  const [state, dispatch] = useGridContext()

  const gridClasses = useGridStyles()
  const inlineGridClasses = useInlineGridStyles()
  const customGridClasses = useCustomGridStyles()
  const breakpoint = useBreakpoint()

  const isParkTabActive = props.activeSegment?.id === PARKED_CONTACTS_LIST_ID
  const resetSelectedRow = () => {
    const {
      selection: { selectedRowIds, isAllRowsSelected, isEntireRowsSelected }
    } = state

    if (
      selectedRowIds.length > 0 ||
      isAllRowsSelected ||
      isEntireRowsSelected
    ) {
      dispatch(resetRows())
    }
  }

  const getSelectedInfo = contactCount => {
    const {
      selection: { selectedRowIds, isEntireRowsSelected, excludedRows }
    } = state

    let selectedCount = selectedRowIds.length

    if (isEntireRowsSelected) {
      selectedCount = contactCount - excludedRows.length
    }

    return selectedCount > 0
      ? `${selectedCount} of ${contactCount} selected`
      : `${contactCount} Contacts`
  }

  const columns = [
    {
      id: 'name',
      headerName: ({ rows, column, width }) => (
        <ColumnHeaderCell
          title={getSelectedInfo(rows.length)}
          isPrimary
          width={width}
          sortable={column.sortable}
        />
      ),
      width: '230px',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ row: contact, isRowSelected, column }) => {
        const name = getAttributeFromSummary(contact, 'display_name')

        if (column.isHidden) {
          return null
        }

        return (
          <EditTextCell
            text={name}
            isPrimary
            isRowSelected={isRowSelected}
            width={column.width}
          />
        )
      }
    },
    {
      id: 'tag',
      headerName: ({ column, width }) => (
        <ColumnHeaderCell
          title="Tags"
          iconPath={mdiTagMultipleOutline}
          sortable={column.sortable}
          width={width}
        />
      ),
      isHidden: ['xs', 'sm'].includes(breakpoint),
      sortable: false,
      width: '200px',
      render: ({ row: contact, isRowSelected, column }) => {
        if (column.isHidden) {
          return null
        }

        return (
          <TagsCell
            contact={contact}
            reloadContacts={props.reloadContacts}
            hasAttributeFilters={
              (props.filters?.attributeFilters || []).length > 0
            }
            isParkTabActive={isParkTabActive}
            isRowSelected={isRowSelected}
            width={column.width}
          />
        )
      }
    },
    {
      id: 'phone',
      headerName: ({ column, width }) => (
        <ColumnHeaderCell
          title="Phone"
          iconPath={mdiPhoneOutline}
          sortable={column.sortable}
          width={width}
        />
      ),
      sortable: false,
      width: '210px',
      render: ({ row: contact, isRowSelected, column }) => {
        if (column.isHidden) {
          return null
        }

        return (
          <PhoneNumberCell
            contact={contact}
            isRowSelected={isRowSelected}
            width={column.width}
          />
        )
      }
    },
    {
      id: 'email',
      headerName: ({ column, width }) => (
        <ColumnHeaderCell
          title="Email"
          iconPath={mdiEmailOutline}
          sortable={column.sortable}
          width={width}
        />
      ),
      sortable: false,
      isHidden: ['xs'].includes(breakpoint),
      width: '290px',
      render: ({ row: contact, isRowSelected, column }) => {
        if (column.isHidden) {
          return null
        }

        return (
          <EmailCell
            contact={contact}
            isRowSelected={isRowSelected}
            width={column.width}
          />
        )
      }
    },
    {
      id: 'last_touched',
      headerName: ({ column, width }) => (
        <ColumnHeaderCell
          title="Last Touch"
          iconPath={mdiCalendarOutline}
          sortable={column.sortable}
          width={width}
          // sortDirection={(
          //   ["last_touch", "-last_touch"].includes(sortOrder) &&
          //   (sortOrder.startsWith("-") ? "desc" : "asc")
          // )}
        />
      ),
      isHidden: ['xs'].includes(breakpoint),
      sortable: false,
      width: '150px',
      render: ({ row: contact, isRowSelected, column }) => {
        if (column.isHidden) {
          return null
        }

        return (
          <LastTouchCell
            contact={contact}
            isRowSelected={isRowSelected}
            width={column.width}
          />
        )
      }
    },
    {
      id: 'flows',
      headerName: ({ column, width }) => (
        <ColumnHeaderCell
          title="Flows"
          iconPath={mdiLightningBoltOutline}
          sortable={column.sortable}
          width={width}
        />
      ),
      width: '110px',
      isHidden: breakpoint !== 'xl',
      render: ({ row: contact, isRowSelected, column }) => {
        if (column.isHidden) {
          return null
        }

        return (
          <FlowsCell
            contact={contact}
            callback={() => {
              resetSelectedRow()
              // find a way to reload without refreshing page
              // props.reloadContacts()
            }}
            width={column.width}
            isRowSelected={isRowSelected}
            flowsCount={Array.isArray(contact.flows) ? contact.flows.length : 0}
          />
        )
      }
    },
    {
      id: 'birthday',
      headerName: ({ column, width }) => (
        <ColumnHeaderCell
          title="Birthday"
          iconPath={mdiCake}
          sortable={column.sortable}
          width={width}
        />
      ),
      sortable: false,
      isHidden: breakpoint !== 'xl',
      width: '180px',
      render: ({ row: contact, isRowSelected, column }) => {
        if (column.isHidden) {
          return null
        }

        return (
          <BirthdayCell
            contact={contact}
            isRowSelected={isRowSelected}
            width={column.width}
          />
        )
      }
    }
  ]

  const getLoading = () => {
    const { isFetching, isFetchingMore, isFetchingMoreBefore } = props

    if (!isFetching && !isFetchingMore && !isFetchingMoreBefore) {
      return null
    }

    if (isFetching) {
      return 'middle'
    }

    if (isFetchingMore) {
      return 'bottom'
    }

    if (isFetchingMoreBefore) {
      return 'top'
    }
  }

  const getRowProps = () => ({})
  const getColumnProps = () => ({})

  return (
    <>
      <Table
        hasHeader
        rows={props.data}
        totalRows={props.totalRows}
        loading={getLoading()}
        columns={columns}
        inlineGridEnabled
        rowSize={5}
        LoadingStateComponent={LoadingComponent}
        getTrProps={getRowProps}
        getTdProps={getColumnProps}
        selection={{
          defaultRender: ({ row }) => <Avatar contact={row} />,
          columnProps: {},
          showSelectAll: false
        }}
        classes={{
          row: cn(gridClasses.row, inlineGridClasses.row, customGridClasses.row)
        }}
        infiniteScrolling={{
          onReachEnd: props.onRequestLoadMore,
          onReachStart: props.onRequestLoadMoreBefore
        }}
        TableActions={
          <TableActions
            filters={props.filters}
            isFetching={props.isFetching}
            totalRowsCount={props.listInfo.total}
            reloadContacts={props.reloadContacts}
            onRequestDelete={props.onRequestDelete}
            activeSegmentId={props.activeSegment?.id ?? ''}
            handleChangeContactsAttributes={
              props.handleChangeContactsAttributes
            }
          />
        }
        EmptyStateComponent={() => (
          // eslint-disable-next-line max-len
          <NoSearchResults description="Try typing another name, email, phone or tag." />
        )}
      />
    </>
  )
}

export default ContactsList
