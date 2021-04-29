import React, { memo } from 'react'
// import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
// import pluralize from 'pluralize'

import { mdiTrashCanOutline } from '@mdi/js'

import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'

// import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { GridActionButton } from 'components/Grid/Table/features/Actions/Button'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

import Email from '../../Actions/Email'
import MergeContacts from '../../Actions/MergeContacts'
import ExportContacts from '../../Actions/ExportContactsButton'
import { TagContacts } from '../../Actions/TagContacts'
import CreateEvent from '../../Actions/CreateEvent'
import AddToFlowAction from '../../Actions/AddToFlow'
import { UnparkContacts } from '../../Actions/UnparkContacts'
import { ActionWrapper } from '../components/ActionWrapper'
import { PARKED_CONTACTS_LIST_ID } from '../../constants'

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     container: {},
//     moreActionContainer: {
//       background: theme.palette.background.paper,
//       zIndex: 1100,
//       borderRadius: theme.shape.borderRadius,
//       boxShadow: `0 0 5px 0 ${theme.palette.text.hint}`
//     },
//     summery: {
//       display: 'flex',
//       alignItems: 'center'
//     },
//     selectedCount: {
//       marginRight: theme.spacing(0.5)
//     }
//   })
// )

interface Props {
  activeSegmentId: string
  totalRowsCount: number
  reloadContacts: () => void
  onRequestDelete: () => void
  filters: any
  isFetching: boolean
  handleChangeContactsAttributes: any
}

const RawTableActions = ({
  filters,
  isFetching,
  activeSegmentId,
  totalRowsCount,
  reloadContacts,
  onRequestDelete,
  handleChangeContactsAttributes
}: Props) => {
  const [state, dispatch] = useGridContext()
  // const classes = useStyles()

  const {
    selection: {
      selectedRowIds,
      excludedRows,
      isAllRowsSelected,
      isEntireRowsSelected
    }
  } = state

  const isAllDisable = !(
    isEntireRowsSelected ||
    isAllRowsSelected ||
    selectedRowIds.length > 0
  )
  const isEntireModeDisable = isEntireRowsSelected ? true : isAllDisable
  const isTwoSelected = selectedRowIds.length >= 2
  const isMergeDisable = !(!isAllRowsSelected
    ? isAllRowsSelected || isTwoSelected
    : isAllRowsSelected && isTwoSelected)
  const isParkedActive = activeSegmentId === PARKED_CONTACTS_LIST_ID

  // const getSummeryInfo = () => {
  //   const selectedCount = isEntireRowsSelected
  //     ? totalRowsCount - excludedRows.length
  //     : selectedRowIds.length

  //   if (selectedCount === 0) {
  //     return null
  //   }

  //   return (
  //     <Box className={classes.summery}>
  //       <Typography variant="subtitle2" className={classes.selectedCount}>
  //         {selectedCount}
  //       </Typography>
  //       <Typography variant="body2">
  //         {pluralize('Contact', selectedCount)} selected
  //       </Typography>
  //     </Box>
  //   )
  // }

  const deselectRows = () => dispatch(resetRows())
  const deselectAndReload = () => {
    deselectRows()
    reloadContacts()
  }

  return (
    <>
      <ActionWrapper disabled={!isParkedActive}>
        <UnparkContacts
          contacts={selectedRowIds}
          excludedRows={excludedRows}
          attributeFilters={filters?.attributeFilters}
          searchText={filters?.text}
          conditionOperator={filters?.filter_type}
          users={filters?.users}
          crm_tasks={filters?.crm_tasks}
          flows={filters?.flows}
          callback={deselectAndReload}
        />
      </ActionWrapper>
      <ActionWrapper disabled={isAllDisable}>
        <TagContacts
          disabled={isAllDisable}
          entireMode={isEntireRowsSelected}
          isParkedActive={isParkedActive}
          excludedRows={excludedRows}
          selectedRows={selectedRowIds}
          attributeFilters={filters?.attributeFilters}
          searchText={filters?.text}
          conditionOperator={filters?.filter_type}
          users={filters?.users}
          crm_tasks={filters?.crm_tasks}
          flows={filters?.flows}
          resetSelectedRows={deselectRows}
          handleChangeContactsAttributes={handleChangeContactsAttributes}
        />
      </ActionWrapper>
      <ActionWrapper
        disabled={!isEntireRowsSelected && selectedRowIds.length === 0}
      >
        <AddToFlowAction
          disabled={!isEntireRowsSelected && selectedRowIds.length === 0}
          entireMode={isEntireRowsSelected}
          excludedRows={excludedRows}
          selectedRows={selectedRowIds}
          parked={isParkedActive}
          filters={filters}
          resetSelectedRows={deselectRows}
          reloadContacts={reloadContacts}
        />
      </ActionWrapper>
      <ActionWrapper disabled={isEntireModeDisable || isParkedActive}>
        <Email disabled={isEntireModeDisable} selectedRows={selectedRowIds} />
      </ActionWrapper>
      <ActionWrapper disabled={isEntireModeDisable || isParkedActive}>
        <CreateEvent
          disabled={isEntireModeDisable}
          selectedRows={selectedRowIds}
          submitCallback={deselectAndReload}
        />
      </ActionWrapper>
      <ActionWrapper disabled={isFetching}>
        <ExportContacts
          excludedRows={excludedRows}
          exportIds={selectedRowIds}
          filters={filters.attributeFilters}
          flows={filters.flows}
          crmTasks={filters.crm_tasks}
          searchText={filters.text}
          conditionOperator={filters.filter_type}
          users={filters.users}
          parked={isParkedActive}
          disabled={isFetching}
        />
      </ActionWrapper>
      <ActionWrapper disabled={isMergeDisable}>
        <MergeContacts
          isEntireMode={isEntireRowsSelected}
          selectedRows={selectedRowIds}
          submitCallback={deselectAndReload}
        />
      </ActionWrapper>
      <ActionWrapper disabled={isAllDisable}>
        <GridActionButton
          label="Delete"
          icon={mdiTrashCanOutline}
          disabled={isAllDisable}
          onClick={onRequestDelete}
        />
      </ActionWrapper>
    </>
  )
}

export const TableActions = memo(RawTableActions)
