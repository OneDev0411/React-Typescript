import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { useActiveBrandId } from '@app/hooks/brand'
import { useQueryParam } from '@app/hooks/use-query-param'
import { useGetSocialPosts } from '@app/models/social-posts'
import { noop } from '@app/utils/helpers'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { EmailInsightsZeroState } from '../../List/ZeroState'

import SocialPostTableColumnActions from './SocialPostTableColumnActions'
import SocialPostTableColumnOwner from './SocialPostTableColumnOwner'
import SocialPostTableColumnPost from './SocialPostTableColumnPost'
import SocialPostTableFilter from './SocialPostTableFilter'
import { SocialPostFilter } from './types'

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

const defaultSocialPosts: ISocialPost<'template_instance' | 'owner'>[] = []

function SocialPostTable() {
  const gridClasses = useGridStyles()
  const classes = useStyles()

  const [filterRaw, setFilter] = useQueryParam<SocialPostFilter>(
    'filter',
    'posted'
  )
  const filter: SocialPostFilter =
    filterRaw === 'posted' ? 'posted' : 'scheduled'

  const activeBrandId = useActiveBrandId()
  const { isFetching, data, fetchNextPage } = useGetSocialPosts(activeBrandId, {
    executed: filter === 'posted' ? 'true' : 'false'
  })

  const socialPosts = data?.pages.flat() || defaultSocialPosts
  const filteredSocialPosts = socialPosts.filter(
    socialPost => !socialPost.failed_at
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

  console.log('filteredSocialPosts', filteredSocialPosts)

  return (
    <>
      <SocialPostTableFilter value={filter} onChange={setFilter} />
      <Table
        rows={filteredSocialPosts ?? []}
        totalRows={filteredSocialPosts?.length ?? 0}
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
        EmptyStateComponent={() => (
          <EmailInsightsZeroState title="There are no Instagram posts." />
        )}
      />
    </>
  )
}

export default SocialPostTable
