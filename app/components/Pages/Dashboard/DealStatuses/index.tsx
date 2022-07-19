import { useMemo, useState } from 'react'

import {
  Box,
  CircularProgress,
  makeStyles,
  Typography,
  Theme,
  Button
} from '@material-ui/core'
import Fuse from 'fuse.js'
import { useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useBrandStatuses } from '@app/hooks/use-brand-statuses'
import useNotify from '@app/hooks/use-notify'
import { confirmation } from '@app/store_actions/confirmation'
import { getDealStatusColor } from '@app/utils/get-deal-status-color'
import { SearchInput } from '@app/views/components/GlobalHeaderWithSearch'
import PageLayout from '@app/views/components/GlobalPageLayout'
import Grid from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'

import { StatusForm } from './StatusForm'

const useStyles = makeStyles(
  (theme: Theme) => ({
    statusColor: {
      display: 'inline-block',
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      borderRadius: '100%',
      marginRight: theme.spacing(1)
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '90vh'
    }
  }),
  {
    name: 'DealStatuses'
  }
)

interface Props {
  params: {
    id: UUID
  }
}

export default function DealStatusesAdmin({ params }: Props) {
  const gridClasses = useGridStyles()
  const classes = useStyles()
  const dispatch = useDispatch()
  const notify = useNotify()

  const activeBrandId = useActiveBrandId()

  const [statuses, upsertStatus, deleteStatus] = useBrandStatuses(activeBrandId)
  const [criteria, setCriteria] = useState('')

  const statusesList = useMemo(() => {
    return criteria
      ? new Fuse(statuses, {
          threshold: 0.2,
          isCaseSensitive: false,
          keys: ['label']
        }).search(criteria)
      : statuses
  }, [statuses, criteria])

  const columns = useMemo(
    () => [
      {
        id: 'name',
        width: '30%',
        accessor: (status: IDealStatus) => status.label,
        render: ({ row: status }) => (
          <Typography variant="body1">
            <span
              className={classes.statusColor}
              style={{
                backgroundColor: getDealStatusColor(status)
              }}
            />

            <strong className="underline-on-hover">{status.label}</strong>
          </Typography>
        )
      },
      {
        id: 'type',
        render: ({ row: status }) => (
          <Typography variant="body2">
            {status.is_active && 'Active'}
            {status.is_pending && 'Pending'}
            {status.is_archived && 'Archived'}
            {status.is_closed && 'Closed'}
          </Typography>
        )
      },
      {
        id: 'admin-only',
        render: ({ row: status }) => (
          <Typography variant="body2">
            {status.admin_only && 'Admin Only'}
          </Typography>
        )
      }
    ],
    [classes.statusColor]
  )

  const selectedStatus = useMemo(() => {
    return statuses.find(status => status.id === params.id)
  }, [params.id, statuses])

  const getRowProps = ({ row: status }) => {
    return {
      onClick: () => browserHistory.push(`/dashboard/statuses/${status.id}`)
    }
  }

  const handleClose = () => browserHistory.push('/dashboard/statuses')

  const handleDeleteStatus = () => {
    if (!selectedStatus) {
      return
    }

    dispatch(
      confirmation({
        message: 'Delete Status',
        description: `Please confirm that you want to 
          delete "${selectedStatus.label}" status`,
        onConfirm: () => {
          deleteStatus(selectedStatus.id)
          handleClose()

          notify({
            status: 'success',
            message: 'Status Deleted'
          })
        }
      })
    )
  }

  return (
    <PageLayout>
      <PageLayout.Header title="Statuses">
        <Box display="flex">
          <Box mr={1}>
            <SearchInput
              placeholder="Search status"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCriteria(e.target.value)
              }
            />
          </Box>

          <Button
            color="primary"
            variant="contained"
            onClick={() => browserHistory.push('/dashboard/statuses/new')}
          >
            Create New Status
          </Button>
        </Box>
      </PageLayout.Header>

      <PageLayout.Main>
        <Grid<IDealStatus>
          columns={columns}
          rows={statusesList}
          totalRows={statusesList.length}
          virtualize={false}
          EmptyStateComponent={() => (
            <Box className={classes.center}>
              <Typography variant="h4">No results found</Typography>
            </Box>
          )}
          LoadingStateComponent={() => (
            <Box className={classes.center}>
              <CircularProgress />
            </Box>
          )}
          loading={statuses.length === 0 ? 'middle' : null}
          getTrProps={getRowProps}
          classes={{
            row: gridClasses.row
          }}
        />

        <StatusForm
          isNewStatus={params.id === 'new'}
          status={selectedStatus}
          onChange={upsertStatus}
          onDelete={handleDeleteStatus}
          onClose={handleClose}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
