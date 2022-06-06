import { useMemo } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { useQueryParam } from '@app/hooks/use-query-param'
import { noop } from '@app/utils/helpers'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { sortSocialPosts } from './helpers'
import SocialPostTableColumnActions from './SocialPostTableColumnActions'
import SocialPostTableColumnOwner from './SocialPostTableColumnOwner'
import SocialPostTableColumnPost from './SocialPostTableColumnPost'
import SocialPostTableFilter from './SocialPostTableFilter'
import { SocialPostZeroState } from './SocialPostZeroState'
import { SocialPostFilter } from './types'
import { useLoadAndFilterSocialPosts } from './use-load-and-filter-social-posts'

const useStyles = makeStyles(
  theme => ({
    row: {
      '&:hover $actions': { opacity: 1 }
    },
    actions: {
      paddingRight: theme.spacing(1),
      opacity: 0,
      transition: theme.transitions.create(['opacity'])
    }
  }),
  {
    name: 'SocialPostTable'
  }
)

interface SocialPostTableProps {
  sortBy: { ascending: boolean }
}

function SocialPostTable({ sortBy }: SocialPostTableProps) {
  const gridClasses = useGridStyles()
  const classes = useStyles()

  const [filterRaw, setFilter] = useQueryParam<SocialPostFilter>(
    'filter',
    'posted'
  )

  const { filteredSocialPosts, isFetching, fetchNextPage, filter } =
    useLoadAndFilterSocialPosts(filterRaw.trim())

  // TODO: I believe it's better to handle the sorting in the backend but I have to write
  // this logic for now to do the release.
  // I and Hossein will discuss this after and make a decision about it.
  const sortedSocialPosts = useMemo(
    () => sortSocialPosts(filteredSocialPosts, sortBy.ascending),
    [filteredSocialPosts, sortBy.ascending]
  )

  const columns: TableColumn<ISocialPost<'template_instance' | 'owner'>>[] = [
    {
      id: 'post',
      primary: true,
      width: '45%',
      render: ({ row }) => <SocialPostTableColumnPost socialPost={row} />
    },
    {
      id: 'user',
      width: '30%',
      render: ({ row }) => <SocialPostTableColumnOwner owner={row.owner} />
    },
    {
      id: 'actions',
      align: 'right',
      class: classes.actions,
      render: ({ row }) => <SocialPostTableColumnActions socialPost={row} />
    }
  ]

  return (
    <>
      <SocialPostTableFilter value={filter} onChange={setFilter} />
      <Table
        rows={sortedSocialPosts ?? []}
        totalRows={sortedSocialPosts?.length ?? 0}
        columns={columns}
        loading={isFetching ? 'middle' : null}
        LoadingStateComponent={LoadingComponent}
        getTrProps={() => ({
          className: classNames(gridClasses.row, classes.row)
        })}
        infiniteScrolling={{
          onReachStart: noop,
          onReachEnd: fetchNextPage
        }}
        EmptyStateComponent={() => <SocialPostZeroState />}
      />
    </>
  )
}

export default SocialPostTable
