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

import { Table } from 'components/Grid/Table'
import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'
import BirthdayCell from 'components/Grid/Table/features/cells/BirthdayCell'
import EmailCell from 'components/Grid/Table/features/cells/EmailCell'
import FlowsCell from 'components/Grid/Table/features/cells/FlowsCell'
import LastTouchCell from 'components/Grid/Table/features/cells/LastTouchCell'
import PhoneNumberCell from 'components/Grid/Table/features/cells/PhoneNumberCell'
import TagsCell from 'components/Grid/Table/features/cells/TagsCell'
import EditTextCell from 'components/Grid/Table/features/cells/types/EditTextCell'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'
import {
  useGridStyles,
  useInlineGridStyles
} from 'components/Grid/Table/styles'
import { getAttributeFromSummary } from 'models/contacts/helpers'

import NoSearchResults from '../../../../../Partials/no-search-results'
import { PARKED_CONTACTS_LIST_ID } from '../constants'

import { TableActions } from './Actions'
import Avatar from './columns/Avatar'
import { LoadingComponent } from './components/LoadingComponent'
import ColumnHeaderCell from './grid/ColumnHeaderCell'

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

  const inlineGridEnabled = true
  const gridClasses = useGridStyles()
  const inlineGridClasses = useInlineGridStyles()
  const customGridClasses = useCustomGridStyles()

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

    let selectedCount

    if (isEntireRowsSelected) {
      selectedCount = contactCount - excludedRows.length
    } else if (selectedRowIds.length > 0) {
      selectedCount = selectedRowIds.length
    }

    return selectedCount
      ? `${selectedCount} of ${contactCount} selected`
      : `${contactCount} Contacts`
  }

  const columns = [
    {
      id: 'name',
      headerName: ({ rows }) => (
        <ColumnHeaderCell
          title={getSelectedInfo(rows.length)}
          isPrimary
          sortEnabled={false}
        />
      ),
      width: '250px',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ row: contact, isRowSelected }) => {
        const name = getAttributeFromSummary(contact, 'display_name')

        return (
          <EditTextCell text={name} isPrimary isRowSelected={isRowSelected} />
        )
      }
    },
    {
      id: 'tag',
      headerName: () => (
        <ColumnHeaderCell
          title="Tags"
          iconPath={mdiTagMultipleOutline}
          sortEnabled={false}
        />
      ),
      width: '210px',
      class: 'tags',
      render: ({ row: contact, isRowSelected }) => (
        <TagsCell
          contact={contact}
          reloadContacts={props.reloadContacts}
          hasAttributeFilters={
            (props.filters?.attributeFilters || []).length > 0
          }
          isParkTabActive={isParkTabActive}
          isRowSelected={isRowSelected}
        />
      )
    },
    {
      id: 'phone',
      headerName: () => (
        <ColumnHeaderCell
          title="Phone"
          iconPath={mdiPhoneOutline}
          sortEnabled={false}
        />
      ),
      width: '210px',
      render: ({ row: contact, isRowSelected }) => (
        <PhoneNumberCell contact={contact} isRowSelected={isRowSelected} />
      )
    },
    {
      id: 'email',
      headerName: () => (
        <ColumnHeaderCell
          title="Email"
          iconPath={mdiEmailOutline}
          sortEnabled={false}
        />
      ),
      width: '310px',
      render: ({ row: contact, isRowSelected }) => (
        <EmailCell contact={contact} isRowSelected={isRowSelected} />
      )
    },
    {
      id: 'last_touch',
      headerName: () => (
        <ColumnHeaderCell
          title="Last Touch"
          iconPath={mdiCalendarOutline}
          sortEnabled={false}
          // sortDirection={(
          //   ["last_touch", "-last_touch"].includes(sortOrder) &&
          //   (sortOrder.startsWith("-") ? "desc" : "asc")
          // )}
        />
      ),
      width: '150px',
      render: ({ row: contact, isRowSelected }) => (
        <LastTouchCell contact={contact} isRowSelected={isRowSelected} />
      )
    },
    {
      id: 'flows',
      headerName: () => (
        <ColumnHeaderCell
          title="Flows"
          iconPath={mdiLightningBoltOutline}
          sortEnabled={false}
        />
      ),
      width: '120px',
      class: 'flows',
      render: ({ row: contact, isRowSelected }) => (
        <FlowsCell
          contact={contact}
          callback={() => {
            resetSelectedRow()
            props.reloadContacts()
          }}
          isRowSelected={isRowSelected}
          flowsCount={Array.isArray(contact.flows) ? contact.flows.length : 0}
        />
      )
    },
    {
      id: 'birthday',
      headerName: () => (
        <ColumnHeaderCell title="Birthday" iconPath={mdiCake} />
      ),
      sortable: false,
      width: '180px',
      render: ({ row: contact, isRowSelected }) => (
        <BirthdayCell contact={contact} isRowSelected={isRowSelected} />
      )
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
        inlineGridEnabled={inlineGridEnabled}
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
          row: cn({
            [gridClasses.row]: !inlineGridEnabled,
            [inlineGridClasses.row]: inlineGridEnabled,
            [customGridClasses.row]: true
          })
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
