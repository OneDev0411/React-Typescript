import { Box, makeStyles, useTheme } from '@material-ui/core'
import {
  mdiCalendarOutline,
  mdiEmailOutline,
  mdiLightningBoltOutline,
  mdiPhoneOutline,
  mdiTagMultipleOutline
} from '@mdi/js'
import cn from 'classnames'

import { Table } from 'components/Grid/Table'
import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'
import { TextInlineEdit } from 'components/Grid/Table/features/inline-edit/Text'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'
import { useGridStyles } from 'components/Grid/Table/styles'
import { getAttributeFromSummary } from 'models/contacts/helpers'
import { goTo } from 'utils/go-to'

import NoSearchResults from '../../../../../Partials/no-search-results'
import { PARKED_CONTACTS_LIST_ID } from '../constants'

import { TableActions } from './Actions'
import Avatar from './columns/Avatar'
import FlowCell from './columns/Flows'
import LastTouched from './columns/LastTouched'
import Name from './columns/Name'
import TagsString from './columns/Tags'
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
  const gridClasses = useGridStyles(true)
  const customGridClasses = useCustomGridStyles()
  const theme = useTheme()
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
      : `${contactCount} CONTACTS`
  }

  const columns = [
    {
      id: 'name',
      headerName: ({ rows }) => (
        <Box sx={{ paddingLeft: '8px' }}>
          <ColumnHeaderCell
            title={getSelectedInfo(rows.length)}
            sortEnabled={false}
          />
        </Box>
      ),
      primary: true,
      width: '220px',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ row: contact }) => <Name contact={contact} />
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
      width: '300px',
      class: 'opaque tags',
      render: ({ row: contact }) => (
        <TagsString
          contact={contact}
          reloadContacts={props.reloadContacts}
          hasAttributeFilters={
            (props.filters?.attributeFilters || []).length > 0
          }
          isParkTabActive={isParkTabActive}
        />
      )
    },
    {
      id: 'phone',
      headerName: () => (
        <ColumnHeaderCell
          title="Phone Number"
          iconPath={mdiPhoneOutline}
          sortEnabled={false}
        />
      ),
      width: '200px',
      renderInlineEdit: ({ row: contact }, close) => (
        <TextInlineEdit
          value={contact.phone_number}
          onSave={() =>
            // TODO: validate phone number?
            // TODO: save the contact's new phone number
            close()
          }
        />
      ),
      render: ({ row: contact }) => {
        let phoneNumber
        let phoneNumberLabel

        contact.attributes?.filter(attr => {
          if (!attr.is_partner && attr.attribute_type === 'phone_number') {
            phoneNumber = attr.text
            phoneNumberLabel = attr.is_primary
              ? 'Main'
              : (phoneNumberLabel = attr.label)

            return true
          }

          return false
        })

        return (
          <div>
            {phoneNumber} {phoneNumberLabel && `(${phoneNumberLabel})`}
          </div>
        )
      }
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
      width: '200px',
      renderInlineEdit: ({ row: contact }, close) => (
        <TextInlineEdit
          value={contact.email}
          onSave={() =>
            // TODO: validate email?
            // TODO: save the contact's new email
            close()
          }
        />
      ),
      render: ({ row: contact }) => {
        let emailAddress
        let emailAddressLabel

        contact.attributes?.filter(attr => {
          if (!attr.is_partner && attr.attribute_type === 'email') {
            emailAddress = attr.text
            emailAddressLabel = attr.is_primary
              ? 'Main'
              : (emailAddressLabel = attr.label)

            return true
          }

          return false
        })

        return (
          <div>
            {emailAddress} {emailAddressLabel && `(${emailAddressLabel})`}
          </div>
        )
      }
    },
    {
      id: 'last_touched',
      headerName: () => (
        <ColumnHeaderCell
          title="Last Touch"
          iconPath={mdiCalendarOutline}
          sortEnabled={false}
        />
      ),
      width: '200px',
      class: 'opaque',
      render: ({ row: contact }) => <LastTouched contact={contact} />
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
      width: '90px',
      class: 'opaque flows',
      render: ({ row: contact }) => (
        <FlowCell
          contactId={contact.id}
          callback={() => {
            resetSelectedRow()
            props.reloadContacts()
          }}
          flowsCount={Array.isArray(contact.flows) ? contact.flows.length : 0}
        />
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

  const getRowProps = ({ row: contact }) => {
    return {
      onClick: () => goTo(`/dashboard/contacts/${contact.id}`)
    }
  }
  const getColumnProps = ({ column }) => {
    if (['name', 'flows', 'tag'].includes(column.id)) {
      return {
        onClick: e => e.stopPropagation()
      }
    }
  }

  return (
    <>
      <Table
        hasHeader
        rows={props.data}
        totalRows={props.totalRows}
        loading={getLoading()}
        columns={columns}
        inlineGridEnabled
        itemSize={theme.spacing(5)}
        LoadingStateComponent={LoadingComponent}
        getTrProps={getRowProps}
        getTdProps={getColumnProps}
        selection={{
          defaultRender: ({ row }) => <Avatar contact={row} />,
          columnProps: {
            width: theme.spacing(7)
          },
          showSelectAll: false
        }}
        classes={{
          row: cn(gridClasses.row, customGridClasses.row)
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
