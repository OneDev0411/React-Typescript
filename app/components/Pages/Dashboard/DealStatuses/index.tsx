import { useSelector } from 'react-redux'

import { CircularProgress, Typography } from '@material-ui/core'
import Fuse from 'fuse.js'

import { useMemo, useState } from 'react'

import { selectUser } from '@app/selectors/user'

import PageLayout from 'components/GlobalPageLayout'

import Grid from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'

import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

export default function DealStatusesAdmin() {
  const gridClasses = useGridStyles()

  const user = useSelector(selectUser)
  const statues: IDealStatus[] = useBrandStatuses(getActiveTeamId(user)!)
  const [criteria, setCriteria] = useState('')

  const statuesList = useMemo(() => {
    return criteria
      ? new Fuse(statues, {
          threshold: 0.2,
          isCaseSensitive: false,
          keys: ['label']
        }).search(criteria)
      : statues
  }, [statues, criteria])

  const columns = useMemo(
    () => [
      {
        id: 'name',
        width: '30%',
        accessor: (status: IDealStatus) => status.label,
        render: ({ row: status }) => (
          <Typography variant="body1">{status.label}</Typography>
        )
      }
    ],
    []
  )

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
          rows={statuesList}
          totalRows={statuesList.length}
          virtualize={false}
          LoadingStateComponent={CircularProgress}
          loading={statues.length === 0 ? 'middle' : null}
          classes={{
            row: gridClasses.row
          }}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
