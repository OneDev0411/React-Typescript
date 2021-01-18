import React, { memo } from 'react'
import {
  Box,
  Button,
  Typography,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import pluralize from 'pluralize'

import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'

import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

import Email from '../../Actions/Email'
import MergeContacts from '../../Actions/MergeContacts'
import ExportContacts from '../../Actions/ExportContactsButton'
import TagContacts from '../../Actions/TagContacts'
import CreateEvent from '../../Actions/CreateEvent'
import AddToFlowAction from '../../Actions/AddToFlow'
import { UnparkContacts } from '../../Actions/UnparkContacts'
import { ActionWrapper } from '../components/ActionWrapper'
import { PARKED_CONTACTS_LIST_ID } from '../../constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      '& > *:not(:last-child)': {
        marginRight: theme.spacing(0.75)
      },
      /*
      since we don't have button with white background in material,
      instead of applying this style to all btn in this component,
      I decided to handle it in this way.
      */
      '& .MuiButton-root': {
        background: theme.palette.background.paper,
        borderColor: theme.palette.grey[300],
        '&:not(:disabled):first-of-type': {
          background: theme.palette.secondary.main,
          borderColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText
        }
      },
      '& $summery': {
        marginRight: theme.spacing(2)
      }
    },
    moreActionContainer: {
      background: theme.palette.background.paper,
      zIndex: 1100,
      borderRadius: theme.shape.borderRadius,
      boxShadow: `0 0 5px 0 ${theme.palette.text.hint}`
    },
    summery: {
      display: 'flex',
      alignItems: 'center'
    },
    selectedCount: {
      marginRight: theme.spacing(0.5)
    }
  })
)

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
  const classes = useStyles()

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
  const getSummeryInfo = () => {
    let selectedCount

    if (isEntireRowsSelected) {
      selectedCount = totalRowsCount - excludedRows.length
    } else if (selectedRowIds.length > 0) {
      selectedCount = selectedRowIds.length
    }

    if (selectedCount) {
      return (
        <Box className={classes.summery}>
          <Typography variant="subtitle2" className={classes.selectedCount}>
            {selectedCount}
          </Typography>
          <Typography variant="body2">
            {pluralize('Contact', selectedCount)} selected
          </Typography>
        </Box>
      )
    }

    return null
  }
  const deselectRows = () => dispatch(resetRows())
  const deselectAndReload = () => {
    deselectRows()
    reloadContacts()
  }

  return (
    <div className={classes.container}>
      {getSummeryInfo()}
      {isParkedActive && (
        <ActionWrapper
          atLeast="one"
          bulkMode={isEntireRowsSelected}
          action="Add Contacts"
          disabled={isEntireModeDisable}
        >
          <UnparkContacts
            contacts={selectedRowIds}
            callback={deselectAndReload}
            disabled={isEntireModeDisable}
          />
        </ActionWrapper>
      )}
      <ActionWrapper
        bulkMode={isEntireRowsSelected}
        atLeast="one"
        action="tagging"
        disabled={isAllDisable}
      >
        <TagContacts
          disabled={isAllDisable}
          entireMode={isEntireRowsSelected}
          totalRowsCount={totalRowsCount}
          excludedRows={excludedRows}
          selectedRows={selectedRowIds}
          filters={filters.attributeFilters}
          searchText={filters.query}
          conditionOperator={filters.filter_type}
          users={filters.users}
          resetSelectedRows={deselectAndReload}
          handleChangeContactsAttributes={handleChangeContactsAttributes}
        />
      </ActionWrapper>
      <AddToFlowAction
        entireMode={isEntireRowsSelected}
        excludedRows={excludedRows}
        selectedRows={selectedRowIds}
        filters={filters}
        resetSelectedRows={deselectRows}
        reloadContacts={reloadContacts}
      />
      {!isParkedActive && (
        <ActionWrapper
          atLeast="one"
          bulkMode={isEntireRowsSelected}
          action="sending an email"
          disabled={isEntireModeDisable}
        >
          <Email disabled={isEntireModeDisable} selectedRows={selectedRowIds} />
        </ActionWrapper>
      )}

      {!isParkedActive && (
        <ActionWrapper
          atLeast="one"
          bulkMode={isEntireRowsSelected}
          action="marketing"
          disabled={isEntireModeDisable}
        >
          <SendMlsListingCard
            disabled={isEntireModeDisable}
            selectedRows={selectedRowIds}
          >
            Marketing
          </SendMlsListingCard>
        </ActionWrapper>
      )}

      {!isParkedActive && (
        <ActionWrapper
          atLeast="one"
          bulkMode={isEntireRowsSelected}
          action="creating an event"
          disabled={isEntireModeDisable}
        >
          <CreateEvent
            disabled={isEntireModeDisable}
            selectedRows={selectedRowIds}
            submitCallback={deselectAndReload}
          />
        </ActionWrapper>
      )}

      <ExportContacts
        excludedRows={excludedRows}
        exportIds={selectedRowIds}
        filters={filters.attributeFilters}
        flows={filters.flows}
        crmTasks={filters.crm_tasks}
        searchText={filters.text}
        conditionOperator={filters.filter_type}
        users={filters.users}
        disabled={isFetching}
      />
      <MergeContacts
        isEntireMode={isEntireRowsSelected}
        disabled={isMergeDisable}
        selectedRows={selectedRowIds}
        submitCallback={deselectAndReload}
      />
      <ActionWrapper
        bulkMode={isEntireRowsSelected}
        atLeast="one"
        action="delete"
        disabled={isAllDisable}
      >
        <Button
          variant="outlined"
          size="small"
          disabled={isAllDisable}
          onClick={onRequestDelete}
        >
          Delete
        </Button>
      </ActionWrapper>
    </div>
  )
}

export const TableActions = memo(RawTableActions)
