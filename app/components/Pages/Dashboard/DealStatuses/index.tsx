import { useMemo, useState } from 'react'

import {
  CircularProgress,
  makeStyles,
  Typography,
  Theme
} from '@material-ui/core'
import Fuse from 'fuse.js'

import { browserHistory } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import Grid from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'

import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { useActiveTeamId } from 'hooks/use-active-team-id'

import { getStatusColorClass } from '@app/utils/listing'

import { EditStatus } from './EditStatus'

const useStyles = makeStyles(
  (theme: Theme) => ({
    statusColor: {
      display: 'inline-block',
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      borderRadius: '100%',
      marginRight: theme.spacing(1)
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

  const teamId = useActiveTeamId()

  const [statuses, updateStatus] = useBrandStatuses(teamId)
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
                backgroundColor: getStatusColorClass(status.label)
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

  return (
    <PageLayout>
      <PageLayout.HeaderWithSearch
        title="Statuses"
        SearchInputProps={{
          placeholder: 'Search status'
        }}
        searchDebounceTime={0}
        onSearch={setCriteria}
      />

      <PageLayout.Main>
        <Grid<IDealStatus>
          columns={columns}
          rows={statusesList}
          totalRows={statusesList.length}
          virtualize={false}
          LoadingStateComponent={CircularProgress}
          loading={statuses.length === 0 ? 'middle' : null}
          getTrProps={getRowProps}
          classes={{
            row: gridClasses.row
          }}
        />

        <EditStatus
          status={selectedStatus}
          onChange={updateStatus}
          onClose={() => browserHistory.goBack()}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
