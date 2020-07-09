import React, { useState } from 'react'
import {
  Button,
  Popper,
  List,
  ListItem,
  ListItemText,
  Typography,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

import { mdiDotsHorizontal } from '@mdi/js'

import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'

import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > *:not(:last-child)': {
        marginRight: theme.spacing(1)
      }
    },
    moreActionContainer: {
      background: theme.palette.background.paper,
      zIndex: 1100,
      borderRadius: theme.shape.borderRadius,
      boxShadow: `0 0 5px 0 ${theme.palette.text.hint}`
    }
  })
)

interface Props {
  totalRowsCount: number
  reloadContacts: () => void
  onRequestDelete: () => void
  filters: any
  isFetching: boolean
  handleChangeContactsAttributes: any
}

export function TableActions({
  filters,
  isFetching,
  totalRowsCount,
  reloadContacts,
  onRequestDelete,
  handleChangeContactsAttributes
}: Props) {
  const [state, dispatch] = useGridContext()
  const classes = useStyles()
  const [moreActionEl, setMoreActionEl] = useState<null | HTMLElement>(null)

  const toggleMoreAction = (event: React.MouseEvent<HTMLElement>) => {
    setMoreActionEl(moreActionEl ? null : event.currentTarget)
  }
  const {
    selection: {
      selectedRowIds,
      excludedRows,
      isAllRowsSelected,
      isEntireRowsSelected
    }
  } = state
  const isMoreActionOpen = Boolean(moreActionEl)
  const moreActionID = isMoreActionOpen ? 'more-action-popper' : undefined

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

  const deselectRows = () => dispatch(resetRows())
  const deselectAndReload = () => {
    deselectRows()
    reloadContacts()
  }

  return (
    <div className={classes.container}>
      <ActionWrapper
        atLeast="one"
        bulkMode={isEntireRowsSelected}
        action="sending an email"
        disabled={isEntireModeDisable}
      >
        <Email disabled={isEntireModeDisable} selectedRows={selectedRowIds} />
      </ActionWrapper>

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
          resetSelectedRows={deselectRows}
          handleChangeContactsAttributes={handleChangeContactsAttributes}
        />
      </ActionWrapper>

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

      <AddToFlowAction
        entireMode={isEntireRowsSelected}
        excludedRows={excludedRows}
        selectedRows={selectedRowIds}
        filters={filters}
        resetSelectedRows={deselectRows}
        reloadContacts={reloadContacts}
      />
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
      <Button
        aria-describedby={moreActionID}
        size="small"
        onClick={toggleMoreAction}
      >
        <SvgIcon path={mdiDotsHorizontal} />
      </Button>
      <Popper
        id={moreActionID}
        open={isMoreActionOpen}
        anchorEl={moreActionEl}
        className={classes.moreActionContainer}
      >
        <List>
          <ListItem button disabled={isAllDisable} onClick={onRequestDelete}>
            <ActionWrapper
              bulkMode={isEntireRowsSelected}
              atLeast="one"
              action="delete"
              disabled={isAllDisable}
            >
              <ListItemText>
                <Typography color="error">Delete</Typography>
              </ListItemText>
            </ActionWrapper>
          </ListItem>
          <MergeContacts
            isEntireMode={isEntireRowsSelected}
            disabled={isMergeDisable}
            selectedRows={selectedRowIds}
            submitCallback={deselectAndReload}
          />
        </List>
      </Popper>
    </div>
  )
}
