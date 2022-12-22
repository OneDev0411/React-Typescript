import { useRef, useMemo } from 'react'

import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
// import DayPicker from 'react-day-picker'

// import { DateTimePicker } from '@app/views/components/DateTimePicker'
import { ContactDetailsModal } from '@app/views/components/ContactDetailsModal'
import { useContactDetailsModalState } from '@app/views/components/ContactDetailsModal/use-contact-details-modal-state'
import { useGridBorderedStyles } from '@app/views/components/Grid/Table/styles/bordered'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { Table } from 'components/Grid/Table'
// import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'
// import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'
// import { getAttributeFromSummary } from 'models/contacts/helpers'

import NoSearchResults from '../../../../../Partials/no-search-results'
// import { PARKED_CONTACTS_LIST_ID } from '../constants'

import { TableActions } from './Actions'
import Avatar from './columns/Avatar'
import { LoadingComponent } from './components/LoadingComponent'
import { useColumns } from './use-columns'

const useCustomGridStyles = makeStyles(theme => ({
  tableContainer: {
    maxWidth: '100%',
    overflowX: 'auto'
  },
  row: {
    '& .column:not(.heading)': {
      padding: theme.spacing(0, 1, 0, 2),
      '&.tags': {
        '& .MuiChip-root': { opacity: 0.5 }
      },
      '&.flows': {
        '& a': { color: theme.palette.grey['500'] },
        '& svg': { fill: theme.palette.grey['500'] }
      }
    },
    '&:hover .column:not(.heading)': {
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
  const gridClasses = useGridStyles()
  const tableContainerRef = useRef(null)
  const gridBorderedClasses = useGridBorderedStyles()
  const customGridClasses = useCustomGridStyles()

  const contactsIdList = useMemo(() => {
    return props.data?.map(contact => contact.id)
  }, [props.data])

  const {
    currentContactId,
    onOpenContact,
    onCloseContact,
    onNextContact,
    onPreviousContact,
    nextButtonDisabled,
    previousButtonDisabled
  } = useContactDetailsModalState('/dashboard/contacts', contactsIdList)

  const columns = useColumns({
    onOpenContact,
    totalRows: props.totalRows,
    tableContainerRef
  })

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

  const handleCloseContact = () => {
    onCloseContact()
  }

  return (
    <>
      <div ref={tableContainerRef}>
        <Table
          headless={false}
          rows={props.data}
          totalRows={props.totalRows}
          loading={getLoading()}
          columns={columns}
          rowSize={5}
          LoadingStateComponent={LoadingComponent}
          getTrProps={getRowProps}
          getTdProps={getColumnProps}
          selection={{
            defaultRender: ({ row }) => <Avatar contact={row} />,
            columnProps: {
              width: '80px'
            },
            showSelectAll: false
          }}
          classes={{
            row: cn(
              gridClasses.row,
              gridBorderedClasses.row,
              customGridClasses.row
            ),
            tableContainer: cn(
              gridClasses.tableContainer,
              gridBorderedClasses.row,
              customGridClasses.tableContainer
            )
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
      </div>
      {currentContactId && (
        <ContactDetailsModal
          isNavigable={props.data && props.data.length > 1}
          contactId={currentContactId}
          onClose={handleCloseContact}
          onNext={onNextContact}
          onPrevious={onPreviousContact}
          onOpen={onOpenContact}
          onUpdateContact={props.onUpdateContact}
          onDeleteContact={props.onDeleteContact}
          nextButtonDisabled={nextButtonDisabled}
          previousButtonDisabled={previousButtonDisabled}
        />
      )}
    </>
  )
}

export default ContactsList
