import { CircularProgress, Typography } from '@material-ui/core'
import Fuse from 'fuse.js'

import { useMemo, useState } from 'react'

import { browserHistory } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import ALink from 'components/ALink'
import Grid from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'

import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { useActiveTeamId } from 'hooks/use-active-team-id'

import { EditStatus } from './EditStatus'

interface Props {
  params: {
    id: UUID
  }
}

export default function DealStatusesAdmin({ params }: Props) {
  const gridClasses = useGridStyles()

  const teamId = useActiveTeamId()

  const statuses: IDealStatus[] = useBrandStatuses(teamId)
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
            <ALink to={`/dashboard/statuses/${status.id}`}>
              {status.label}
            </ALink>
          </Typography>
        )
      }
    ],
    []
  )

  const selectedStatus = useMemo(() => {
    return statuses.find(status => status.id === params.id)
  }, [params.id, statuses])

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
          classes={{
            row: gridClasses.row
          }}
        />

        <EditStatus
          status={selectedStatus}
          onClose={() => browserHistory.goBack()}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
