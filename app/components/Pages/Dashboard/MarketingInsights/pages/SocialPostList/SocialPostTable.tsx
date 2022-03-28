import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { useQueryParam } from '@app/hooks/use-query-param'
import { useGetSocialPosts } from '@app/models/social-posts'
import { selectActiveBrandId } from '@app/selectors/brand'
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

function SocialPostTable() {
  const gridClasses = useGridStyles()
  const classes = useStyles()

  const [filterRaw, setFilter] = useQueryParam<SocialPostFilter>(
    'filter',
    'posted'
  )
  const filter: SocialPostFilter =
    filterRaw === 'posted' ? 'posted' : 'scheduled'

  const activeBrandId = useSelector(selectActiveBrandId)
  const { isFetching, data, fetchNextPage } = useGetSocialPosts(activeBrandId, {
    executed: filter === 'posted' ? 'true' : 'false'
  })

  const socialPosts =
    data?.pages.reduce((items, page) => [...items, ...page], []) || []

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
        rows={socialPosts ?? []}
        totalRows={socialPosts?.length ?? 0}
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
