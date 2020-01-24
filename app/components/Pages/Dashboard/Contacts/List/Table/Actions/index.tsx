import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'

import { StateContext, DispatchContext } from 'components/Grid/Table/context'

import IconButton from 'components/Button/IconButton'

import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'

import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import Email from '../../Actions/Email'
import MergeContacts from '../../Actions/MergeContacts'
import ExportContacts from '../../Actions/ExportContactsButton'
import TagContacts from '../../Actions/TagContacts'
import CreateEvent from '../../Actions/CreateEvent'
import AddToFlowAction from '../../Actions/AddToFlow'
import { ActionWrapper } from '../components/ActionWrapper'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '& button': {
        marginLeft: theme.spacing(1)
      }
    }
  })
)

interface Props {
  state: StateContext
  dispatch: DispatchContext
  totalRowsCount: number
  reloadContacts: () => void
  onRequestDelete: () => void
  filters: any
  isFetching: boolean
  handleChangeContactsAttributes: any
}

export function TableActions({
  state,
  dispatch,
  filters,
  isFetching,
  totalRowsCount,
  reloadContacts,
  onRequestDelete,
  handleChangeContactsAttributes
}: Props) {
  const classes = useStyles()

  const entireMode = state.selection.isEntireRowsSelected
  const isAnyRowsSelected =
    state.selection.isEntireRowsSelected ||
    state.selection.selectedRowIds.length > 0

  const deselectRows = () => dispatch(resetRows())
  const deselectAndReload = () => {
    deselectRows()
    reloadContacts()
  }

  return (
    <div className={classes.container}>
      <ExportContacts
        excludedRows={state.selection.excludedRows}
        exportIds={state.selection.selectedRowIds}
        filters={filters.attributeFilters}
        flows={filters.flows}
        crmTasks={filters.crm_tasks}
        searchText={filters.text}
        conditionOperator={filters.filter_type}
        users={filters.users}
        disabled={isFetching}
      />

      <ActionWrapper
        atLeast="one"
        bulkMode={entireMode}
        action="sending an email"
        disabled={!isAnyRowsSelected}
      >
        <Email
          disabled={!isAnyRowsSelected}
          selectedRows={state.selection.selectedRowIds}
        />
      </ActionWrapper>

      <ActionWrapper
        atLeast="one"
        bulkMode={entireMode}
        action="marketing"
        disabled={!isAnyRowsSelected}
      >
        <SendMlsListingCard
          disabled={!isAnyRowsSelected}
          selectedRows={state.selection.selectedRowIds}
        >
          Marketing
        </SendMlsListingCard>
      </ActionWrapper>

      <ActionWrapper
        bulkMode={entireMode}
        atLeast="one"
        action="tagging"
        disabled={!isAnyRowsSelected}
      >
        <TagContacts
          disabled={!isAnyRowsSelected}
          entireMode={entireMode}
          totalRowsCount={totalRowsCount}
          excludedRows={state.selection.excludedRows}
          selectedRows={state.selection.selectedRowIds}
          filters={filters.attributeFilters}
          searchText={filters.query}
          conditionOperator={filters.filter_type}
          users={filters.users}
          resetSelectedRows={deselectRows}
          handleChangeContactsAttributes={handleChangeContactsAttributes}
        />
      </ActionWrapper>

      <ActionWrapper
        atLeast="one"
        bulkMode={entireMode}
        action="creating an event"
        disabled={!isAnyRowsSelected}
      >
        <CreateEvent
          disabled={!isAnyRowsSelected}
          selectedRows={state.selection.selectedRowIds}
          submitCallback={deselectAndReload}
        />
      </ActionWrapper>

      <AddToFlowAction
        entireMode={entireMode}
        excludedRows={state.selection.excludedRows}
        selectedRows={state.selection.selectedRowIds}
        filters={filters}
        resetSelectedRows={deselectRows}
        reloadContacts={reloadContacts}
      />

      <ActionWrapper
        bulkMode={entireMode}
        action="merging"
        atLeast="two"
        disabled={!isAnyRowsSelected}
      >
        <MergeContacts
          disabled={!isAnyRowsSelected}
          selectedRows={state.selection.selectedRowIds}
          submitCallback={deselectAndReload}
        />
      </ActionWrapper>

      <ActionWrapper
        bulkMode={entireMode}
        atLeast="one"
        action="delete"
        disabled={!isAnyRowsSelected}
      >
        <IconButton
          disabled={!isAnyRowsSelected}
          size="small"
          appearance="outline"
          onClick={onRequestDelete}
        >
          <IconDeleteOutline />
        </IconButton>
      </ActionWrapper>
    </div>
  )
}
